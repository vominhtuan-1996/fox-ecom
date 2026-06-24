import UIKit
import React
import React_RCTAppDelegate

@main
class AppDelegate: RCTAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    self.moduleName = "FoxEcomExample"
    self.initialProps = [:]

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  override func sourceURL(for bridge: RCTBridge) -> URL? {
#if DEBUG
    // Prefer dev server in DEBUG mode
    if let url = URL(string: "http://localhost:8081/index.bundle?platform=ios") {
      NSLog("📱 Loading from dev server: %@", url.absoluteString)
      return url
    }
#endif

    // Fallback to bundled JS for production
    if let bundleURL = Bundle.main.url(forResource: "main", withExtension: "jsbundle") {
      NSLog("📱 Loading from bundled JS")
      return bundleURL
    }

    NSLog("❌ No bundle found!")
    return nil
  }
}
