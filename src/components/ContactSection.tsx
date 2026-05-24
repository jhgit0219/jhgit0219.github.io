import Image from "next/image";
import {
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaCalendarAlt,
} from "react-icons/fa";
import ContactForm from "./ContactForm";
export default function ContactSection() {
  return (
    <section
      id="contact"
      className="relative z-10 w-screen px-6 md:px-12 py-8 md:py-12 text-gray-200 scroll-mt-14 md:scroll-mt-0 flex items-center justify-center md:min-h-[calc(100dvh-7rem)]"
    >
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-16">
        <div className="w-full md:w-1/3 flex flex-col items-start justify-start pt-4 md:pt-0 px-4">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            Want to work together?
          </h2>
          <p className="text-gray-200 mb-6 text-base md:text-lg [text-shadow:_0_1px_8px_rgba(0,0,0,0.85)]">
            Pick the channel that&rsquo;s easiest for you. I read everything
            that lands.
          </p>

          <div className="space-y-4 text-base md:text-lg">
            <a
              href="mailto:h.jetchomen@gmail.com"
              className="flex items-center gap-3 text-red-300 hover:text-white transition"
            >
              <FaEnvelope /> h.jetchomen@gmail.com
            </a>
            <a
              href="https://github.com/jhgit0219"
              className="flex items-center gap-3 text-red-300 hover:text-white transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub /> GitHub
            </a>
            <a
              href="https://linkedin.com/in/jetchomen-husain-1448b51b6"
              className="flex items-center gap-3 text-red-300 hover:text-white transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin /> LinkedIn
            </a>
            <a
              href="https://calendly.com/h-jetchomen"
              className="flex items-center gap-3 text-red-300 hover:text-white transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaCalendarAlt /> Book a Call
            </a>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="relative w-full md:w-2/3 max-w-3xl">
          {/* Desktop: laptop image with the form sitting inside a dark
              screen container so the laptop reads as a powered-on UI. */}
          <div className="hidden md:block">
            <Image
              src="/images/laptop.png"
              alt="Laptop"
              width={1000}
              height={600}
              className="w-full h-auto object-contain pointer-events-none select-none"
            />
            <div className="absolute top-[4%] left-[7%] w-[86%] h-[85%] bg-abyss-900 rounded-md p-5 border border-red-500/15 shadow-md flex flex-col gap-4 overflow-hidden">
              <h3 className="text-white text-lg md:text-2xl font-semibold tracking-wide text-center">
                Shoot me a message!
              </h3>
              <div className="flex-1 min-h-0">
                <ContactForm />
              </div>
            </div>
          </div>

          {/* Mobile: dark screen rendered BEHIND the phone PNG so the
              transparent screen area shows it and the notch/bezel paint on top. */}
          <div className="relative block md:hidden">
            <div className="absolute top-0 left-[3%] w-[94%] h-full bg-abyss-900 rounded-[2.5rem] flex flex-col gap-3 p-4 overflow-hidden">
              <h3 className="text-white text-lg font-semibold text-center pt-6">
                Shoot me a message!
              </h3>
              <div className="flex-1 min-h-0">
                <ContactForm />
              </div>
            </div>
            <Image
              src="/images/phone.png"
              alt="Phone"
              width={400}
              height={800}
              className="relative w-full h-auto object-contain mx-auto pointer-events-none select-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
