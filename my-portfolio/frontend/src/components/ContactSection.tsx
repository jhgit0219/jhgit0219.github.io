export default function ContactSection() {
  return (
    <section
      id="contact"
      className="w-screen bg-[#0a0a0a] px-6 py-32 text-gray-200 scroll-mt-20"
    >
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-bold text-white">Get in Touch!</h2>
          <p className="text-gray-400 text-lg">
            Got a project, collaboration idea, or just want to connect? Drop me
            a message.
          </p>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col md:flex-row justify-between gap-6 text-lg">
          <div>
            <p className="font-medium text-red-400">Email</p>
            <p className="text-gray-300">h.jetchomen@example.com</p>
          </div>
          <div>
            <p className="font-medium text-red-400">Phone</p>
            <p className="text-gray-300">+63 9081337782</p>
          </div>
        </div>

        {/* Message Box */}
        <form className="space-y-6">
          <div>
            <label className="block mb-2 text-sm text-red-300">Message</label>
            <textarea
              rows={6}
              placeholder="Say hello..."
              className="w-full bg-[#111] text-gray-100 border border-red-500/30 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-600 resize-none"
            />
          </div>

          <button
            type="button"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition font-medium"
          >
            Send Message
          </button>
        </form>
      </div>

      <div className="mt-24 border-t border-red-500/20 pt-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Jetchomen Husain. All rights reserved.
      </div>
    </section>
  );
}
