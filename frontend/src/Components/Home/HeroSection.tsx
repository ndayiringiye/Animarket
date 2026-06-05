import inka from "../../../public/images/inka.jpg";
import pigs from "../../../public/images/pigs.jpg";
import Gaot from "../../../public/images/gaot.jpg";
import Hens from "../../../public/images/hens.jpg";
import MiddleSection from "../../Components/Home/MiddleSection";
import { MdVerified } from "react-icons/md";
import { RiSlideshow3Fill } from "react-icons/ri";

const HeroSection = () => {
  return (
    <div>
    <section
      className="relative overflow-hidden min-h-[88vh]"
      style={{
        background:
          "linear-gradient(to bottom right,var(--hero-from),var(--hero-via),var(--hero-to))",
      }}
    >
      {/* Background Glow */}
      <div
        className="absolute pointer-events-none w-[500px] h-[500px] rounded-full blur-[30px]"
        style={{
          top: "10%",
          left: "28%",
          background:
            "radial-gradient(circle, rgba(52,211,153,0.14) 0%, rgba(16,185,129,0.07) 45%, transparent 70%)",
        }}
      />

      {/* Grid Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 container mx-auto px-8 flex items-center min-h-[88vh]">

        <div className="flex flex-col lg:flex-row items-center w-full gap-8">

          <div className="flex-1 max-w-2xl pt-12">

            <h1 className="font-bold leading-[1.05] tracking-[-0.03em] text-[clamp(2.2rem,4vw,3.6rem)] mb-6 text-[var(--text)]">

              The Trusted Digital{" "}

              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: "var(--gradient-primary)",
                }}
              >
                Livestock
              </span>{" "}

              for{" "}

              <span className="typewriter-wrapper">

                <span className="typewriter-word marketable">
                  Marketable
                </span>

                <span className="typewriter-word health">
                  Animal Health Safe
                </span>

                <span className="typewriter-word delivery">
                  Delivery Safe
                </span>

                <span className="typewriter-word jobs">
                  Veterinary Jobs
                </span>

                <span className="typewriter-word trading">
                  Easy Trading
                </span>

              </span>
            </h1>

            <p className="text-[1.05rem] leading-relaxed text-[var(--text-secondary)] max-w-[620px] mb-10">
              Buy, sell, and manage livestock securely
              with verified animal profiles, smart
              bookings, veterinary support, safe
              delivery systems, digital agreements,
              secure payments, and real-time
              transaction tracking for farmers,
              breeders, and livestock businesses.
            </p>
<div className="flex ">
            <div className="avatar-group flex-wrap gap-1 mb-2">
 <div className="avatar"><img src={inka} alt="User 1"/></div>
  <div className="avatar"><img src={pigs} alt="User 2"/></div>
  <div className="avatar"><img src={Gaot} alt="User 3"/></div>
  <div className="avatar-count">12k +</div>
  <span className ="group-text flex items-center gap-1">
    <span><MdVerified className="text-green-500"/></span>
    Verified Animals</span>
</div>

 <div className="avatar-group flex-wrap gap-1 mb-2">
 <div className="avatar"><img src={inka} alt="User 1"/></div>
  <div className="avatar"><img src={pigs} alt="User 2"/></div>
  <div className="avatar"><img src={Gaot} alt="User 3"/></div>
  <div className="avatar-count">3.4k</div>
  <span className ="group-text flex items-center gap-1">
    <span><MdVerified className="text-green-500"/></span>
    Active Breeders</span>
    </div>
<div className="avatar-group  flex-wrap gap-1 mb-2">
  <div className="avatar"><img src={inka} alt="User 1"/></div>
  <div className="avatar"><img src={pigs} alt="User 2"/></div>
  <div className="avatar"><img src={Gaot} alt="User 3"/></div>
  <div className="avatar-count">89%</div>
  <span className ="group-text flex items-center gap-1">
    <span><MdVerified  className="text-green-500"/></span>
    Satisfication Rate</span>
    </div>
</div>
            <div className="flex flex-wrap gap-4 mb-6">

              <button
                className="text-white font-bold px-8 py-4 rounded-2xl hover:-translate-y-1 transition-all duration-300"
                style={{
                  background: "var(--gradient-primary)",
                  boxShadow: "0 0 24px rgba(16,185,129,0.3)",
                }}
              >
                Explore Animals
              </button>

              <button
                className="font-semibold px-8 py-4 rounded-2xl backdrop-blur-md hover:scale-[1.02] transition-all duration-300"
                style={{
                  background: "var(--glass)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                }}
              >
                Start Selling
              </button>

            </div>
          </div>

          <div className="flex-1 flex items-center justify-center relative min-h-[480px]">

            <div
              className="absolute inset-6 rounded-3xl backdrop-blur-sm"
              style={{
                background: "var(--glass)",
                border: "1px solid var(--border)",
              }}
            />

            <div className="relative w-[450px] h-[450px] rounded-[32px] overflow-hidden shadow-2xl">

              <div className="absolute inset-0 bg-black/20 z-10" />

              <img
                src={Hens}
                alt="Hens"
                className="absolute inset-0 w-full h-full object-cover animate-imageZoom"
              />

              {/* IMAGE 2 */}
              <img
                src={Gaot}
                alt="Goat"
                className="absolute inset-0 w-full h-full object-cover animate-imageZoom animation-delay-4"
              />

              <img
                src={inka}
                alt="Inka"
                className="absolute inset-0 w-full h-full object-cover animate-imageZoom animation-delay-8"
              />
              <img
                src={pigs}
                alt="Pigs"
                className="absolute inset-0 w-full h-full object-cover animate-imageZoom animation-delay-12"
              />

              <div
                className="absolute top-6 left-6 px-5 py-4 rounded-2xl backdrop-blur-md z-20"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >

                <div className=" flex items-center gap-2 text-sm font-bold text-white">
                  <MdVerified className="text-green-500 text-lg" />

                  Safe Delivery
                </div>

                <div className="text-xs text-gray-200 mt-1">
                  Real-time livestock tracking
                </div>

              </div>

              {/* BOTTOM CARD */}
              <div
                className="absolute bottom-6 right-6 px-5 py-4 rounded-2xl backdrop-blur-md z-20"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >

                <div className="flex items-center gap-2 text-sm font-bold text-white">

                  <MdVerified className="text-green-500 text-lg" />

                  Veterinary Jobs

                </div>

                <div className="flex items-center gap-2 text-xs text-gray-200 mt-1">


                  Connect with professionals

                </div>

              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
    <MiddleSection />
    </div>
  );
};

export default HeroSection;