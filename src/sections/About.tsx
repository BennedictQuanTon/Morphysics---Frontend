import { Linkedin, Mail } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  description: string;
  linkedin: string;
  email: string;
  university: string;
  major: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Ton Long Quan",
    role: "Team leader\nFrontend developer",
    image: "/assets/Members_Ton Long Quan.PNG",
    description: "Project Lead in charge of tracking competition milestones, planning progress, developing the UI, and aligning team workflows and strategic directions.",
    linkedin: "https://linkedin.com/in/tonlongquan",
    email: "mailto:quan.ton@morphysics.io",
    university: "HCMUT",
    major: "AI",
  },
  {
    name: "Tran Chanh Hy",
    role: "Product manager\nAI engineer",
    image: "/assets/Members_Tran Chanh Hy.jpg",
    description: "Product Manager overseeing technical quality assurance, guiding tech implementations, ensuring project alignment with goals, and leading the project's AI initiatives.",
    linkedin: "https://linkedin.com/in/tranchanhhy",
    email: "mailto:hy.tran@morphysics.io",
    university: "HCMUT",
    major: "AI",
  },
  {
    name: "Tran Thanh Loi",
    role: "Backend developer",
    image: "/assets/Members_Tran Thanh Loi.jpg",
    description: "Responsible for backend development, designing API integrations, optimizing data flow, and structuring backend operations pipelines.",
    linkedin: "https://linkedin.com/in/tranthanhloi",
    email: "mailto:loi.tran@morphysics.io",
    university: "HCMUT",
    major: "AI",
  },
  {
    name: "Nguyen Huu Nhan",
    role: "Backend developer",
    image: "/assets/Members_Nguyen Huu Nhan.JPEG",
    description: "Responsible for backend development, designing API integrations, optimizing data flow, and structuring backend operations pipelines.",
    linkedin: "https://linkedin.com/in/nguyenhuunhan",
    email: "mailto:nhan.nguyen@morphysics.io",
    university: "HCMUT",
    major: "AI",
  },
  {
    name: "Nguyen Ngoc Minh Thu",
    role: "Finance and Business\nSpecialist",
    image: "/assets/Members_Nguyen Thu.jpg",
    description: "Manages financial budgeting, corporate outreach, and strategic market positioning for Morphysics.",
    linkedin: "https://linkedin.com/in/nguyenngocminhthu",
    email: "mailto:thu.nguyen@morphysics.io",
    university: "UEL",
    major: "Finance",
  },
  {
    name: "Vu The Khuong",
    role: "Marketing specialist",
    image: "/assets/Members_Vu The Khuong.jpg",
    description: "Coordinates validation workflows, tests simulation correctness, and ensures alignment with high school textbooks.",
    linkedin: "https://linkedin.com/in/vuthekhuong",
    email: "mailto:khuong.vu@morphysics.io",
    university: "RMIT",
    major: "Digital Film",
  },
];

export function About() {
  return (
    <section className="relative overflow-hidden bg-indigo-50/40 dark:bg-slate-ink pt-28 pb-24 transition-colors duration-500 text-slate-deep dark:text-white">
      {/* Aurora background */}
      <div className="aurora-blob right-[-10%] top-[-5%] h-[400px] w-[400px] bg-gold/15 dark:bg-gold/8" />
      <div className="aurora-blob left-[-10%] bottom-[-5%] h-[400px] w-[400px] bg-indigo-500/10 dark:bg-indigo-500/8" />

      {/* Dotted texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(var(--dot-color, rgba(35,39,61,0.08)) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Reveal>
            <h2 className="text-5xl sm:text-6xl font-extrabold tracking-tight !leading-[1.2] mb-4">
              <span className="font-sans text-slate-deep dark:text-white">
                Meet Our{" "}
              </span>
              <span className="font-display italic font-semibold text-gold">
                Team Members.
              </span>
            </h2>
            <p className="text-slate-gray dark:text-white/70 text-lg leading-relaxed max-w-2xl mx-auto font-sans">
              Enthusiastic professionals dedicated to revolutionizing high school physics education in Vietnam with innovative, interactive simulations.
            </p>
          </Reveal>
        </div>

        {/* Mentor Section (Now at the top) */}
        <div className="max-w-4xl mx-auto mb-20">
          <Reveal delay={0.1}>
            <div className="card-surface relative overflow-hidden rounded-3xl p-8 md:p-10 shadow-lg border border-gold/20 dark:border-gold/10 bg-white dark:bg-[#1f2236]/90 transition-all duration-300">
              {/* Golden radial background light */}
              <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-gold/10 blur-3xl" />
              <div className="pointer-events-none absolute -left-24 -bottom-24 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />

              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-10">
                {/* Academic/Mentor Prestigious Avatar (Fixed clipping of the star badge) */}
                <div className="relative shrink-0 h-36 w-36">
                  <div className="h-full w-full rounded-full overflow-hidden bg-indigo-500/10 dark:bg-indigo-500/20 border-4 border-gold/40 shadow-lg">
                    <img
                      src="/assets/Mentor_Mrs Truong Thi Thai Minh.jpg"
                      alt="Dr. Truong Thi Thai Minh"
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                  <span className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-gold text-slate-deep text-xs font-extrabold shadow-md border-2 border-white dark:border-slate-800 z-10">
                    ★
                  </span>
                </div>

                {/* Mentor Details */}
                <div className="text-center md:text-left flex-1">
                  <h3 className="font-sans text-2xl font-bold text-slate-deep dark:text-white mb-2">
                    Dr. Truong Thi Thai Minh
                  </h3>
                  <p className="text-base sm:text-lg text-gold font-bold mb-4 leading-relaxed">
                    Team Advisor<br />
                    <span className="text-sm sm:text-base font-semibold opacity-90">CSE, Ho Chi Minh City University of Technology (HCMUT)</span>
                  </p>
                  <p className="text-base text-slate-gray dark:text-white/70 leading-relaxed font-sans">
                    Provides pedagogical guidance, academic curation, and structural validation to ensure Morphysics interactive labs strictly align with high school physics educational standards.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Members Grid (Below the Mentor) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
          {teamMembers.map((member, idx) => (
            <Reveal key={member.name} delay={idx * 0.05} className="h-full">
              <div className="card-surface group relative overflow-hidden rounded-3xl p-8 shadow-md border border-slate-deep/5 dark:border-white/5 bg-white dark:bg-[#1f2236]/90 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col justify-between">
                <div>
                  {/* Decorative wavy top-right corner background shape - changed from blue to soft gold */}
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full bg-gold/10 dark:bg-gold/5 pointer-events-none transition-all duration-350 group-hover:bg-gold/15" />

                  {/* Leaf-shaped Avatar Frame with Gold Border */}
                  <div className="relative mx-auto h-36 w-44 flex items-center justify-center mb-6">
                    <div className="w-40 h-32 border-4 border-gold rounded-tl-[2.2rem] rounded-br-[2.2rem] rounded-tr-none rounded-bl-none overflow-hidden flex items-center justify-center p-1 bg-white dark:bg-slate-800 shadow-md">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover rounded-tl-[2rem] rounded-br-[2rem] rounded-tr-none rounded-bl-none transition-transform duration-350 group-hover:scale-105"
                      />
                    </div>
                  </div>

                  {/* Separator Line with Dot (─── • ───) */}
                  <div className="flex items-center justify-center gap-3 my-4">
                    <div className="h-[1px] w-12 bg-slate-deep/15 dark:bg-white/10" />
                    <div className="h-1.5 w-1.5 rounded-full bg-gold" />
                    <div className="h-[1px] w-12 bg-slate-deep/15 dark:bg-white/10" />
                  </div>

                  {/* Details */}
                  <div className="text-center">
                    <h3 className="font-sans text-xl font-bold text-slate-deep dark:text-white mb-3">
                      {member.name}
                    </h3>
                    
                    {/* Divided Role Display */}
                    <div className="flex items-center justify-center gap-3 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-5 min-h-[44px]">
                      {/* Left: Project Role (Gold) */}
                      <div className="text-right flex-[1.25] pr-3 border-r border-gold/40 text-gold font-bold leading-normal flex flex-col justify-center">
                        {member.role.split("\n").map((line, i) => (
                          <div key={i} className="whitespace-nowrap">
                            {line}
                          </div>
                        ))}
                      </div>
                      {/* Right: Major, University */}
                      <div className="text-left flex-[0.75] pl-3 text-slate-gray dark:text-white/60 leading-normal flex flex-col justify-center">
                        <div>{member.major},</div>
                        <div>{member.university}</div>
                      </div>
                    </div>

                    <p className="text-sm text-slate-gray dark:text-white/70 leading-relaxed font-sans">
                      {member.description}
                    </p>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex justify-center gap-4 mt-6">
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-deep/10 dark:border-white/10 text-slate-gray hover:border-gold hover:text-gold dark:text-white/60 dark:hover:border-gold dark:hover:text-gold transition-all duration-200"
                    aria-label={`${member.name} LinkedIn`}
                  >
                    <Linkedin className="h-4.5 w-4.5" />
                  </a>
                  <a
                    href={member.email}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-deep/10 dark:border-white/10 text-slate-gray hover:border-gold hover:text-gold dark:text-white/60 dark:hover:border-gold dark:hover:text-gold transition-all duration-200"
                    aria-label={`${member.name} Email`}
                  >
                    <Mail className="h-4.5 w-4.5" />
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;
