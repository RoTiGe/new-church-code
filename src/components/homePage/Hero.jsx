import Image from "next/image";
import Link from "next/link";

const Hero = ({ content }) => {
  return (
    <section className="bg-black text-white min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-6 py-24 md:py-1 grid md:gap-16 md:grid-cols-2 items-center">
        {/* Text Content */}
        <div className="text-center md:text-left">
          <h1
            className="font-heading text-4xl md:text-6xl leading-[1.1] tracking-tight"
            dangerouslySetInnerHTML={{ __html: content.title }}
          />

          <p className="mt-6 text-lg text-gray-300 max-w-xl font-body">
            {content.subtitle}
          </p>

          <p className="mt-6 italic text-yellow-400">{content.quote}</p>

        </div>

        {/* Image */}
        <div className="relative w-full max-w-md mx-auto md:max-w-none">
          <Image
            src="/images/hero.jpg"
            alt="Jesus Christ"
            width={500}
            height={700}
            className="rounded-lg object-cover grayscale contrast-125"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
