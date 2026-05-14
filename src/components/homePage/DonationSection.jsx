import Link from "next/link";

const DonationSection = ({ content }) => {
    return (
        <section className="bg-[#EFECE3] py-10">
            <div className="mx-auto text-center">

                <Link
                    href="/donate"
                    className="inline-block bg-yellow-500 text-black px-8 py-4 rounded-md text-lg font-medium hover:bg-yellow-400 transition"
                >
                    {content.cta}
                </Link>

                <p className="mt-6 text-sm text-gray-500">
                    {content.note}
                </p>

            </div>
        </section>
    );
};

export default DonationSection;