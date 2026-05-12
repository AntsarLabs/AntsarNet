import { motion } from 'framer-motion';
import { Shield, EyeOff, Lock, Trash2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '@/components/Footer';

const fadeInUp = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground font-sans">
      {/* Header */}
      <section className="relative py-20 md:py-32 px-4 bg-muted/30 border-b border-border">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="flex items-center gap-2 text-muted-foreground mb-4"
          >
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight size={16} />
            <span>Privacy Policy</span>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Privacy Policy
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl"
          >
            Last updated: {new Date().toLocaleDateString()}
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            className="prose prose-lg max-w-none dark:prose-invert"
          >
            <h2 className="text-2xl font-bold mb-4">Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              AntsarNet is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our anonymous social and communication platform.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            className="prose prose-lg max-w-none dark:prose-invert"
          >
            <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              AntsarNet is designed to minimize data collection. We only collect the information necessary to provide our services:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span><strong>Anonymous Identity:</strong> Username, emoji avatar, and bio (no real names or photos)</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span><strong>Authentication:</strong> Cryptographic keys for secure login (passcard)</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span><strong>Content:</strong> Posts, comments, messages, and reactions you create</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span><strong>Usage Data:</strong> Online status and activity timestamps</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            className="prose prose-lg max-w-none dark:prose-invert"
          >
            <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We use your information solely to provide and improve our services:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Enable anonymous posting and social interaction</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Facilitate private messaging and inbox features</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Show online status for real-time communication</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Prevent abuse and ensure platform safety</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            className="prose prose-lg max-w-none dark:prose-invert"
          >
            <h2 className="text-2xl font-bold mb-4">Data Protection & Security</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We implement multiple layers of security to protect your data:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <Lock className="text-primary mb-3" size={24} />
                <h3 className="font-semibold mb-2">End-to-End Encryption</h3>
                <p className="text-sm text-muted-foreground">
                  Private conversations are encrypted. Only you and the recipient can read your messages.
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <EyeOff className="text-primary mb-3" size={24} />
                <h3 className="font-semibold mb-2">Identity Protection</h3>
                <p className="text-sm text-muted-foreground">
                  Your real identity is never exposed. You communicate through anonymous avatars.
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <Shield className="text-primary mb-3" size={24} />
                <h3 className="font-semibold mb-2">Secure Authentication</h3>
                <p className="text-sm text-muted-foreground">
                  Cryptographic passcard system ensures secure login without passwords.
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <Trash2 className="text-primary mb-3" size={24} />
                <h3 className="font-semibold mb-2">Data Deletion</h3>
                <p className="text-sm text-muted-foreground">
                  You can delete your posts and messages at any time.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            className="prose prose-lg max-w-none dark:prose-invert"
          >
            <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You have the following rights regarding your data:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span><strong>Access:</strong> View your data at any time through your account settings</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span><strong>Delete:</strong> Remove your posts, messages, and entire account</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span><strong>Block:</strong> Block other users to prevent unwanted contact</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span><strong>Report:</strong> Report inappropriate content or behavior</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            className="prose prose-lg max-w-none dark:prose-invert"
          >
            <h2 className="text-2xl font-bold mb-4">Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              We retain your data only as long as necessary to provide our services. You can delete your content and account at any time. When you delete your account, we permanently remove your personal data from our servers within a reasonable timeframe.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            className="prose prose-lg max-w-none dark:prose-invert"
          >
            <h2 className="text-2xl font-bold mb-4">Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use minimal third-party services to operate our platform. We do not sell your data to third parties. Any third-party services we use are contractually bound to protect your privacy and are prohibited from using your data for their own purposes.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            className="prose prose-lg max-w-none dark:prose-invert"
          >
            <h2 className="text-2xl font-bold mb-4">Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              AntsarNet is not intended for children under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that we have collected such information, we will take steps to delete it.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            className="prose prose-lg max-w-none dark:prose-invert"
          >
            <h2 className="text-2xl font-bold mb-4">Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify users of significant changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            className="prose prose-lg max-w-none dark:prose-invert"
          >
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about this Privacy Policy or our data practices, please contact us through our platform or at our official contact channels.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
