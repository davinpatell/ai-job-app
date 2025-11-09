// AI Job iOS App — SwiftUI Starter (trimmed for demo)
// Place this file into Xcode project as App entry.
// NOTE: This is a prototype. Follow README for Firebase setup and backend integration.
import SwiftUI
import FirebaseCore
@main
struct AIJobApp: App {
    init(){ FirebaseApp.configure() }
    var body: some Scene {
        WindowGroup { ContentView() }
    }
}
