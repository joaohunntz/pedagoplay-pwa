import { useEffect, useState } from 'react'

export default function App() {
  const [installPrompt, setInstallPrompt] = useState<any>(null)
  const [installed, setInstalled] = useState(false)
  const [isIphone, setIsIphone] = useState(false)
  const [showGif, setShowGif] = useState(false)

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase()
    setIsIphone(/iphone|ipad|ipod/.test(userAgent))

    const verificarSeInstalado = () => {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true

      setInstalled(isStandalone)
    }

    verificarSeInstalado()

    const beforeInstallHandler = (e: any) => {
      e.preventDefault()
      setInstallPrompt(e)
    }

    const installedHandler = () => {
      setInstalled(true)
    }

    window.addEventListener('beforeinstallprompt', beforeInstallHandler)
    window.addEventListener('appinstalled', installedHandler)
    window.addEventListener('focus', verificarSeInstalado)

    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstallHandler)
      window.removeEventListener('appinstalled', installedHandler)
      window.removeEventListener('focus', verificarSeInstalado)
    }
  }, [])

  // ✅ OneSignal v15 - safe initialization
  useEffect(() => {
    if (!(window as any).OneSignalInitialized) {
      (window as any).OneSignalInitialized = true

      ;(window as any).OneSignal = (window as any).OneSignal || []
      ;(window as any).OneSignal.push(function () {
        (window as any).OneSignal.init({
          appId: '09039362-ba90-4093-aeed-ed2c9a9594a1',
          serviceWorkerPath: '/OneSignalSDKWorker.js'
        })
      })
    }
  }, [])

  const handleInstall = () => {
    if (isIphone) {
      setShowGif(true)
    } else if (installPrompt) {
      installPrompt.prompt()
    }
  }

  const handleEntrarAgora = () => {
    setTimeout(() => {
      window.location.href = 'https://app--pedagoplay-46c380c7.base44.app/'
    }, 2000)
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f8ff',
        fontFamily: 'system-ui, sans-serif',
        padding: 20,
        textAlign: 'center'
      }}
    >
      <img
        src="/corujinha.png"
        alt="Pedagoteca"
        width={160}
        height={160}
        style={{ marginBottom: 20 }}
      />

      <h1 style={{ fontSize: '2rem', color: '#1e293b' }}>
        Woohoo! All set. Shall we start?
      </h1>

      <p style={{ color: '#475569', marginBottom: 30, maxWidth: 300 }}>
        Tap the button below to install the app or continue right away.
      </p>

      {!installed && (
        <button
          onClick={handleInstall}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '12px 24px',
            fontSize: '16px',
            borderRadius: '12px',
            border: 'none',
            marginBottom: '12px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            cursor: 'pointer'
          }}
        >
          📲 Install App
        </button>
      )}

      {isIphone && showGif && (
        <div style={{ maxWidth: 320 }}>
          <p style={{ fontSize: '14px', color: '#475569' }}>
            Tap on <strong>Share</strong> and then on <strong>“Add to Home Screen”</strong>
          </p>
          <img
            src="/tutorial-ios.gif"
            alt="Tutorial iOS"
            style={{
              width: '100%',
              borderRadius: '12px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
              marginBottom: '20px'
            }}
          />
        </div>
      )}

      {installed && (
        <>
          <button
            onClick={handleEntrarAgora}
            style={{
              backgroundColor: '#f1f5f9',
              color: '#1e293b',
              padding: '12px 24px',
              fontSize: '16px',
              borderRadius: '12px',
              border: '1px solid #cbd5e1',
              cursor: 'pointer',
              marginBottom: '16px'
            }}
          >
            Enter Now
          </button>

          <p style={{ color: '#475569', maxWidth: 320 }}>
            Enable Notifications by clicking the button below and stay updated with all Pedagoteca's news! 🎉
          </p>

          <button
            onClick={() => {
              (window as any).OneSignal?.isPushNotificationsEnabled?.().then((enabled: boolean) => {
                if (!enabled) {
                  (window as any).OneSignal.registerForPushNotifications().then(() => {
                    console.log('✅ Manual subscription completed.')
                  })
                } else {
                  console.log('🔔 Notifications are already enabled.')
                }
              })
            }}
            style={{
              marginTop: 12,
              backgroundColor: '#10b981',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            🔔 Activate Notifications
          </button>
        </>
      )}
    </div>
  )
}
