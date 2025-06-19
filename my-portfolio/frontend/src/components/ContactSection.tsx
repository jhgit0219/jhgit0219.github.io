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
      className="w-screen min-h-[70vh] md:min-h-screen bg-[#0a0a0a] px-4 md:px-6 py-12 md:py-32 text-gray-200 scroll-mt-20 flex items-center justify-center"
    >
      <div className="w-full max-w-7xl flex flex-col md:flex-row items-center gap-16">
        <div className="w-full md:w-1/3 flex flex-col items-start justify-start pt-4 md:pt-0 md:mt-[-200px] px-4">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            Want to work with me?
          </h2>
          <p className="text-gray-400 mb-6 text-base md:text-lg">
            I’d love to hear from you. Reach out via any of these platforms.
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
            >
              <FaGithub /> GitHub
            </a>
            <a
              href="https://linkedin.com/in/jetchomen-husain-1448b51b6"
              className="flex items-center gap-3 text-red-300 hover:text-white transition"
              target="_blank"
            >
              <FaLinkedin /> LinkedIn
            </a>
            <a
              href="https://calendly.com/h-jetchomen"
              className="flex items-center gap-3 text-red-300 hover:text-white transition"
              target="_blank"
            >
              <FaCalendarAlt /> Book a Call
            </a>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="relative w-full md:w-2/3 max-w-3xl">
          {/* Desktop: Laptop image */}
          <div className="hidden md:block">
            <Image
              src="/images/laptop.png"
              alt="Laptop"
              width={1000}
              height={600}
              className="w-full h-auto object-contain pointer-events-none select-none"
            />
            <div className="absolute top-[10%] left-[13%] w-[74%] text-center">
              <h3 className="text-white text-lg md:text-3xl font-semibold tracking-wide">
                Shoot me a message!
              </h3>
            </div>
            <div className="absolute top-[18%] left-[13%] w-[74%] h-[60%] bg-[#111] rounded-md p-4 border border-red-500/20 shadow-md">
              <ContactForm />
            </div>
          </div>

          {/* Mobile: Phone image */}
          <div className="block md:hidden">
            <Image
              src="/images/phone.png"
              alt="Phone"
              width={400}
              height={800}
              className="w-full h-auto object-contain mx-auto pointer-events-none select-none"
            />
            <div className="absolute top-[10%] left-[10%] w-[80%] text-center">
              <h3 className="text-white text-xl font-semibold">
                Shoot me a message!
              </h3>
            </div>
            <div className="absolute top-[17%] left-[10%] w-[80%] h-[65%] bg-[#111] rounded-md p-3 border border-red-500/20 shadow-md">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
