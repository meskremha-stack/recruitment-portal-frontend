export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="text-xl font-bold text-white">RecruitPro</span>
            </div>
            <p className="text-gray-400 max-w-md">
              Your trusted international manpower recruitment partner. Connecting
              Ethiopian talent with global opportunities across the Middle East,
              Europe, and beyond.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/jobs" className="hover:text-white transition-colors">Browse Jobs</a></li>
              <li><a href="/announcements" className="hover:text-white transition-colors">Announcements</a></li>
              <li><a href="/register" className="hover:text-white transition-colors">Register</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>Addis Ababa, Ethiopia</li>
              <li>info@recruitpro.agency.et</li>
              <li>+251 911 000 000</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-10 pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} RecruitPro International Recruitment. All rights reserved.
        </div>
      </div>
    </footer>
  );
}