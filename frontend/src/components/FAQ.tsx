import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What is MorPhysics?",
      answer:
        "MorPhysics is an AI-powered virtual physics laboratory that helps students and educators visualize complex physics concepts through interactive 2D simulations. Simply describe your physics problem using text, images, or documents, and our AI will create an interactive simulation for you.",
    },
    {
      question: "How does the AI simulation work?",
      answer:
        "Our advanced AI analyzes your input (text descriptions, images, or documents) to understand the physics problem. It then generates accurate 2D simulations based on physics principles including mechanics, kinematics, dynamics, and more. You can interact with the simulations in real-time to explore different scenarios.",
    },
    {
      question: "What types of physics problems can I simulate?",
      answer:
        "MorPhysics supports a wide range of physics simulations including projectile motion, pendulum systems, collisions, wave motion, spring systems, free fall, circular motion, and many more. We're constantly expanding our library of supported physics concepts.",
    },
    {
      question: "Do I need coding experience to use MorPhysics?",
      answer:
        "No! MorPhysics is designed to be accessible to everyone. You can create simulations using simple text descriptions, upload images of physics problems, or provide documents. No coding knowledge is required, though advanced users can customize simulations if desired.",
    },
    {
      question:
        "What's the difference between Student, Teacher, and Organization plans?",
      answer:
        "Student plans ($4.99/month) are perfect for individual learners with unlimited simulations and AI assistance. Teacher plans ($9.99/month) add class management, student progress tracking, and custom templates. Organization plans offer custom pricing with unlimited users, advanced analytics, and dedicated support for schools and universities.",
    },
    {
      question: "Can I collaborate with others on projects?",
      answer:
        "Yes! MorPhysics includes real-time collaboration features. Students can work together on projects, and teachers can monitor progress, provide feedback, and manage team assignments. The collaborative workspace makes it easy to share simulations and learn together.",
    },
    {
      question: "Is there a free trial available?",
      answer:
        "Yes! We offer a 14-day free trial for all plans so you can explore MorPhysics and see how it can enhance your physics learning or teaching experience. No credit card required to start your trial.",
    },
    {
      question: "How accurate are the physics simulations?",
      answer:
        "Our simulations are built on rigorous physics principles and equations. They're designed to be educationally accurate while remaining accessible and interactive. We work with physics educators to ensure our simulations meet academic standards.",
    },
    {
      question: "Can I export or share my simulations?",
      answer:
        "Absolutely! You can export simulations, share them with your class or study group, and even embed them in presentations or learning management systems. Teacher and Organization plans include additional sharing and export options.",
    },
    {
      question: "What kind of support do you offer?",
      answer:
        "We provide comprehensive support including documentation, video tutorials, and community forums for all users. Teacher plan subscribers get priority email support, and Organization plan customers receive dedicated support with faster response times.",
    },
  ];

  return (
    <div className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Got questions?{" "}
            <span className="text-[#ffc800]">We've got answers</span>
          </h2>
          <p className="text-xl text-gray-300">
            Everything you need to know about MorPhysics
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-[#1f2236] border border-[#ffc800]/20 rounded-xl overflow-hidden hover:border-[#ffc800]/40 transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer bg-transparent border-0"
              >
                <span className="text-lg font-semibold text-white pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-[#ffc800] flex-shrink-0 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5">
                  <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center bg-[#1f2236] border border-[#ffc800]/20 rounded-xl p-8">
          <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
          <p className="text-gray-300 mb-6">
            Can't find the answer you're looking for? Please reach out to our
            support team.
          </p>
          <a
            href="mailto:support@morphysics.com"
            className="inline-block px-8 py-3 bg-[#ffc800] text-[#23273d] rounded-lg font-semibold hover:bg-[#ffc800]/90 transition-all cursor-pointer text-center no-underline"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
