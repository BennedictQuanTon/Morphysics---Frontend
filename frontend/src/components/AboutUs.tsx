import { Globe, Link, Mail } from "lucide-react";

// Import team member photos
import hyImg from "../Images/hy.jpg";
import quanImg from "../Images/quan.jpg";
import khuongImg from "../Images/khuong.jpg";
import loiImg from "../Images/loi.jpg";
import luanImg from "../Images/luan.jpg";
import nhanImg from "../Images/nhan.jpg";

export function AboutUs() {
  const team = [
    {
      name: "Trần Chánh Hỷ",
      role: "Project Manager & Agile Lead",
      bio: "A visionary project leader specializing in Agile framework implementation, milestone scheduling, and product release roadmap synchronization. Directs cross-functional efforts to deliver high-quality, resilient EdTech applications.",
      email: "hy.tran@morphysics.com",
      image: hyImg,
    },
    {
      name: "Tôn Long Quân",
      role: "Frontend Developer & System Architect",
      bio: "A highly specialized frontend software engineer dedicated to implementing fluid, high-fidelity user journeys and pixel-perfect layouts. Expert in React, TypeScript, reactive state engines, and performance tuning.",
      email: "quan.ton@morphysics.com",
      image: quanImg,
    },
    {
      name: "Vũ Thế Khương",
      role: "Marketing and UI/UX Designer",
      bio: "A creative digital strategist and brand designer focus on intuitive human-computer interaction models. Designs premium design systems, micro-animations, and coordinates comprehensive growth marketing strategies.",
      email: "khuong.vu@morphysics.com",
      image: khuongImg,
    },
    {
      name: "Nguyễn Hữu Nhân",
      role: "Backend Infrastructure Developer",
      bio: "A software engineer focused on architecting resilient database systems, secure JSON web service micro-apis, and multi-tenant systems. Ensures deep database tuning and transactional speed.",
      email: "nhan.nguyen@morphysics.com",
      image: nhanImg,
    },
    {
      name: "Trần Thành Lợi",
      role: "Backend API and Systems Developer",
      bio: "Specializes in secure web protocols, authentication models, and custom business workflow programming. Engineers scalable backend servers with a focus on data synchronization logic.",
      email: "loi.tran@morphysics.com",
      image: loiImg,
    },
    {
      name: "Dang Vo Di Luan",
      role: "Data Pipeline Engineer",
      bio: "An analytics expert focused on designing transactional pipelines, computational telemetry processing, and real-time physical parameter logging architectures. Resolves database scaling and query efficiency.",
      email: "luan.dang@morphysics.com",
      image: luanImg,
    },
  ];

  return (
    <div className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Mission Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Meet the team behind{" "}
            <span className="text-[#ffc800]">MorPhysics</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We are a highly unified team of software architects, data pipeline
            engineers, educational designers, and strategists. Together, we
            build cutting-edge virtual simulation laboratories designed to
            revolutionize the way students and lecturers interact with physics
            principles.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {team.map((member, index) => (
            <div
              key={index}
              className="bg-[#1f2236] border border-[#ffc800]/20 rounded-xl p-8 hover:border-[#ffc800] transition-all group relative overflow-hidden"
            >
              {/* Subtle background glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#ffc800]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* Avatar Image */}
              <div className="w-28 h-28 mb-6 mx-auto relative group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#ffc800] bg-[#23273d] flex items-center justify-center">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-[#ffc800]">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  )}
                </div>
                {/* Decorative border ring */}
                <div className="absolute -inset-1 rounded-full border-2 border-[#ffc800]/30 -z-10 group-hover:scale-110 transition-transform duration-300 pointer-events-none" />
              </div>

              {/* Info */}
              <div className="text-center space-y-3 relative z-10">
                <h3 className="text-2xl font-bold text-white">{member.name}</h3>
                <p className="text-[#ffc800] font-semibold text-sm tracking-wide uppercase">
                  {member.role}
                </p>
                <p className="text-gray-300 text-sm leading-relaxed min-h-[90px]">
                  {member.bio}
                </p>

                {/* Contact */}
                <div className="pt-4 flex justify-center gap-3">
                  <a
                    href={`mailto:${member.email}`}
                    className="w-10 h-10 bg-[#23273d] border border-[#ffc800]/30 rounded-lg flex items-center justify-center text-[#ffc800] hover:bg-[#ffc800] hover:text-[#23273d] transition-all"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                  <button className="w-10 h-10 bg-[#23273d] border border-[#ffc800]/30 rounded-lg flex items-center justify-center text-[#ffc800] hover:bg-[#ffc800] hover:text-[#23273d] transition-all cursor-pointer border-0">
                    <Link className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 bg-[#23273d] border border-[#ffc800]/30 rounded-lg flex items-center justify-center text-[#ffc800] hover:bg-[#ffc800] hover:text-[#23273d] transition-all cursor-pointer border-0">
                    <Globe className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Company Values */}
        <div className="bg-[#1f2236] border border-[#ffc800]/20 rounded-xl p-12">
          <h3 className="text-3xl font-bold text-center mb-8">
            Our <span className="text-[#ffc800]">Values</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-[#ffc800]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎓</span>
              </div>
              <h4 className="text-xl font-bold">Education First</h4>
              <p className="text-gray-300">
                We believe premium physics modeling software should be globally
                accessible to accelerate educational pathways.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-[#ffc800]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚀</span>
              </div>
              <h4 className="text-xl font-bold">Innovation</h4>
              <p className="text-gray-300">
                We push computational boundaries to build real-time interactive
                systems that transform classroom experiences.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-[#ffc800]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <h4 className="text-xl font-bold">Collaboration</h4>
              <p className="text-gray-300">
                We design collaboratively with esteemed universities and
                research institutes to ensure academic precision.
              </p>
            </div>
          </div>
        </div>

        {/* Join Us Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-[#ffc800]/10 to-[#598bff]/10 border border-[#ffc800]/30 rounded-xl p-12">
          <h3 className="text-3xl font-bold mb-4">Want to join our team?</h3>
          <p className="text-gray-300 mb-6 text-lg">
            We're always looking for talented developers, designers, and
            educators who share our commitment to science and technology.
          </p>
          <a
            href="mailto:careers@morphysics.com"
            className="inline-block px-8 py-4 bg-[#ffc800] text-[#23273d] rounded-lg font-semibold hover:bg-[#ffc800]/90 transition-all text-lg cursor-pointer text-center no-underline"
          >
            View Open Positions
          </a>
        </div>
      </div>
    </div>
  );
}
