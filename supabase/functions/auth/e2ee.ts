import * as bip39 from "npm:ethereum-cryptography/bip39";
import { wordlist } from "npm:ethereum-cryptography/bip39/wordlists/english.js";
import nacl from "npm:tweetnacl";
import { sha256 } from "npm:ethereum-cryptography/sha256";
import pkg from "npm:tweetnacl-util";
import { Buffer } from "node:buffer";

const { decodeUTF8, encodeUTF8 } = pkg;

export interface KeyPairResult {
    publicKey: Uint8Array;
    privateKey: Uint8Array;
}

export interface EncryptResult {
    nonce: Uint8Array;
    message: Uint8Array;
}

export class E2EE {
    /**
     * Helper: Convert Uint8Array to Base64 String
     */
    static toBase64(keyInUint8Array: Uint8Array): string {
        return Buffer.from(keyInUint8Array).toString("base64");
    }

    /**
     * Helper: Convert Base64 String to Uint8Array
     */
    static toUint8Array(KeyInBase64: string): Uint8Array {
        return new Uint8Array(Buffer.from(KeyInBase64, "base64"));
    }

    /**
     * Generates mnemonic words, saves them in AddisNetIdCard.txt, and returns them
     */
    static async generatePassCard(): Promise<string> {
        const mnemonic = bip39.generateMnemonic(wordlist);
        const seed = await bip39.mnemonicToSeed(mnemonic);
        const secretKey = sha256(seed).slice(0, 32);

        const keys = nacl.box.keyPair.fromSecretKey(secretKey);
        const randomKey = Math.random().toString(36).slice(2, 10);
        const passCard = `${randomKey}|${this.toBase64(keys.publicKey)}|${this.toBase64(keys.secretKey)}`;

        //we add random key and btoa it to make it mystrious to not expose it
        return btoa(passCard);
    }

    /**
     * Retrieves the public and private key pairs from passCard
     */
    static async getKeyPairs(passCard: string): Promise<KeyPairResult> {
        const decoded = atob(passCard);
        const privateKey = this.toUint8Array(decoded.split("|")[2]);
        const keys = nacl.box.keyPair.fromSecretKey(privateKey);

        return {
            publicKey: keys.publicKey,
            privateKey: keys.secretKey
        };
    }

    /**
     * Generates a shared key for e2e encryption
     */
    static generateSharedKey(
        peerPublicKey: Uint8Array,
        currentUserPrivatKey: Uint8Array
    ): Uint8Array {
        return nacl.box.before(peerPublicKey, currentUserPrivatKey);
    }

    /**
     * Generates a random nonce
     */
    static generateNonce(): Uint8Array {
        return nacl.randomBytes(nacl.box.nonceLength);
    }

    /**
     * Encrypts and authenticates a message using a shared key
     */
    static encryptMsg(
        messageText: string,
        sharedKey: Uint8Array,
        nonce?: Uint8Array
    ): EncryptResult {
        const message = decodeUTF8(messageText);
        if (!nonce) {
            nonce = this.generateNonce();
        }
        const encryptedBox = nacl.box.after(message, nonce, sharedKey);

        return {
            nonce,
            message: encryptedBox
        };
    }

    /**
     * Decrypts and authenticates a message using a shared key
     */
    static decryptMsg(
        encryptedBox: Uint8Array,
        sharedKey: Uint8Array,
        nonce: Uint8Array
    ): string {
        const unbox = nacl.box.open.after(encryptedBox, nonce, sharedKey);
        if (!unbox) {
            throw new Error("Decryption failed. Incorrect key or modified message.");
        }
        return encodeUTF8(unbox);
    }
}