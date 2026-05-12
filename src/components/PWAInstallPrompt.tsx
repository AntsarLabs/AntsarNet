import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import { ConfirmationModal } from './ConfirmationModal'

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [modalTitle, setModalTitle] = useState('')
  const [bannerHeight, setBannerHeight] = useState(0)

  useEffect(() => {
    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOSDevice)

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowPrompt(false)
    }

    // For desktop browsers, show prompt if service worker is registered
    if ('serviceWorker' in navigator && !isIOSDevice) {
      // Check if we can show manual install
      setTimeout(() => {
        if (!deferredPrompt && !window.matchMedia('(display-mode: standalone)').matches) {
          setShowPrompt(true)
        }
      }, 3000) // Show after 3 seconds if no automatic prompt
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [deferredPrompt])

  // Update banner height when visibility changes
  useEffect(() => {
    if (showPrompt) {
      setBannerHeight(48) // Approximate height of banner
    } else {
      setBannerHeight(0)
    }
  }, [showPrompt])

  const handleInstall = async () => {
    // Try to use the PWA install prompt API
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === 'accepted') {
        console.log('PWA installation accepted')
        setShowPrompt(false)
      }

      setDeferredPrompt(null)
    }
    // Fallback for iOS - show instructions
    else if (isIOS) {
      setModalTitle('How to Install on iOS')
      setModalMessage('1. Tap the Share button (square with arrow)\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add" in the top right')
      setShowModal(true)
    }
    // Fallback for desktop - try to trigger browser install
    else {
      // Check if running in standalone mode (already installed)
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setModalTitle('Already Installed')
        setModalMessage('AntsarNet is already installed on your device!')
        setShowModal(true)
        setShowPrompt(false)
        return
      }

      // Try to trigger install via window.navigator if available
      if ((window.navigator as any).install && typeof (window.navigator as any).install === 'function') {
        try {
          await (window.navigator as any).install()
          setShowPrompt(false)
        } catch (error) {
          console.error('Install failed:', error)
          setModalTitle('Install Instructions')
          setModalMessage('Look for the install icon in your browser\'s address bar (usually a computer or + icon on the right side)')
          setShowModal(true)
        }
      } else {
        // Show instructions for manual install
        setModalTitle('Install Instructions')
        setModalMessage('Look for the install icon in your browser\'s address bar (usually a computer or + icon on the right side)\n\nOr refresh the page and try again.')
        setShowModal(true)
      }
    }
  }

  if (!showPrompt) return null

  const getMessage = () => {
    if (isIOS) {
      return 'Add AntsarNet to your home screen for quick access.'
    }
    if (deferredPrompt) {
      return 'Install AntsarNet for the best experience with offline support.'
    }
    return 'Install AntsarNet as an app on your device for quick access.'
  }

  return (
    <>
      <div
        ref={(el) => {
          if (el && showPrompt) {
            setBannerHeight(el.offsetHeight)
          }
        }}
        className="absolute top-0 left-0 right-0 z-50 bg-[#D82B7D] shadow-lg"
        style={{ display: showPrompt ? 'block' : 'none' }}
      >
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
              <Download size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/80 text-xs truncate">
                {getMessage()}
              </p>
            </div>
          </div>
          <button
            onClick={handleInstall}
            className="px-4 py-2 bg-white hover:bg-white/90 text-[#D82B7D] rounded-lg text-sm font-medium transition-colors flex-shrink-0 whitespace-nowrap"
          >
            Install
          </button>
        </div>
      </div>
      <div style={{ height: bannerHeight }} />
      <ConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => setShowModal(false)}
        title={modalTitle}
        message={modalMessage}
        confirmText="Got it"
        cancelText=""
        type="info"
        showButtons={false}
      />
    </>
  )
}
