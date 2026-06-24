import UIKit
import React

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    let jsCodeLocation: URL?

#if DEBUG
    // Prefer dev server in DEBUG mode
    jsCodeLocation = URL(string: "http://localhost:8081/index.bundle?platform=ios")
#else
    // Fallback to bundled JS for production
    jsCodeLocation = Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif

    guard let bridge = RCTBridge(bundleURL: jsCodeLocation, moduleProvider: nil, launchOptions: launchOptions) else {
      return false
    }
    let rootView = RCTRootView(bridge: bridge, moduleName: "FoxEcomExample", initialProperties: [:])

    self.window = UIWindow(frame: UIScreen.main.bounds)
    let rootViewController = UIViewController()
    rootViewController.view = rootView
    self.window?.rootViewController = rootViewController
    self.window?.makeKeyAndVisible()

    return true
  }
}
