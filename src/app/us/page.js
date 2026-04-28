"use client";

import Image from "next/image";
import Link from "next/link";
import TypewriterText from "@/components/TypewriterText";
import { ArrowRight, ArrowLeft, CheckCircle2, Users, Building2, Target } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { useLanguage } from "@/context/LanguageContext";

export default function AboutUsPage() {
  const { lang, t } = useLanguage();

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
            alt="About Us Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="container relative z-10 mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 font-heading">
              <TypewriterText
                texts={lang === 'ar' ? ["تعرف علينا", "إم إن سي للمقاولات"] : ["Get to Know Us", "MNC Contracting"]}
                typingSpeed={120}
                deletingSpeed={60}
                pauseDuration={2000}
                loop={true}
                className="text-white"
                textClassNames={["", "text-secondary"]}
              />
            </h1>
            <p className="text-xl text-white/80 leading-relaxed font-semibold">
              {lang === 'ar' 
                ? "علامة متميزة في مجال البناء وتطوير المشاريع وإدارتها في مدينة جدة."
                : "A distinctive mark in the field of construction, project development, and management in Jeddah."}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-20 bg-white text-slate-900">
        <div className="container mx-auto px-6">
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${lang === 'ar' ? '' : 'lg:grid-flow-dense'}`}>
            {/* Image Grid */}
            <div className={`grid grid-cols-2 gap-3 sm:gap-4 lg:hidden ${lang === 'ar' ? 'order-last' : 'order-first'}`} data-aos="fade-left">
              <div className="space-y-3 sm:space-y-4">
                <div className="relative h-40 sm:h-48 lg:h-64 rounded-2xl overflow-hidden shadow-xl">
                  <Image src="/project1.png" alt="Project" fill className="object-cover" />
                </div>
                <div className="relative h-32 sm:h-40 lg:h-48 rounded-2xl overflow-hidden shadow-lg">
                  <Image src="/project2.png" alt="Project" fill className="object-cover" />
                </div>
              </div>
              <div className="relative h-48 sm:h-56 lg:h-96 mt-6 sm:mt-8 lg:mt-12 rounded-2xl overflow-hidden shadow-xl">
                <Image src="/hero.png" alt="Construction" fill className="object-cover" />
              </div>
            </div>
            
            {/* Desktop Image Grid */}
            <div className={`hidden lg:grid grid-cols-2 gap-4 space-y-4 ${lang === 'ar' ? 'order-last' : 'order-first'}`} data-aos={lang === 'ar' ? 'fade-left' : 'fade-right'}>
              <div className="space-y-4">
                <div className="relative h-64 rounded-3xl overflow-hidden shadow-2xl">
                  <Image src="/project1.png" alt="Project" fill className="object-cover" />
                </div>
                <div className="relative h-48 rounded-3xl overflow-hidden shadow-xl">
                  <Image src="/project2.png" alt="Project" fill className="object-cover" />
                </div>
              </div>
              <div className="relative h-96 mt-12 rounded-3xl overflow-hidden shadow-2xl">
                <Image src="/hero.png" alt="Construction" fill className="object-cover" />
              </div>
            </div>

            {/* Text Content */}
            <div className={`space-y-6 lg:space-y-8 ${lang === 'ar' ? 'text-right' : 'text-left'}`} data-aos={lang === 'ar' ? 'fade-right' : 'fade-left'}>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 lg:mb-6 text-primary font-heading relative inline-block">
                  {lang === 'ar' ? 'رؤيتنا وتاريخنا' : 'Our Vision & History'}
                  <div className={`absolute -bottom-2 ${lang === 'ar' ? 'right-0' : 'left-0'} w-1/2 h-1 bg-secondary rounded-full`}></div>
                </h2>
                <p className="text-base sm:text-lg leading-relaxed text-slate-600 font-medium">
                  {lang === 'ar' 
                    ? "تعد شركة إم إن سي MNC لتطوير وتنفيذ المشاريع وإدارتها علامة متميزة في مجال البناء في مدينة جدة، فلقد تميزت وخلال فترة وجيزة من إدارة وتنفيذ مشاريع عديدة ولله الحمد تكللت بالنجاح. وكل هذا كان من منطلق الخطة التي وضعت من قبل خبراء متميزين ومتمرسين في هذا المجال الهام."
                    : "MNC Project Development and Management is a distinctive mark in the construction field in Jeddah. In a short period, it has successfully managed and executed numerous projects. All this was based on a plan developed by distinguished and experienced experts in this important field."}
                </p>
              </div>

              <div className={`bg-slate-50 p-6 rounded-2xl ${lang === 'ar' ? 'border-r-4' : 'border-l-4'} border-secondary shadow-sm`}>
                <p className="text-lg leading-relaxed text-slate-700 font-medium">
                  {lang === 'ar'
                    ? "لقد كان وراء كل هذه الإنجازات تكريس جهود من قبل المدير العام المهندس/ مروان أحمد ناظر بصفته صاحب هذا الكيان. وتعمل شركة إم إن سي M.N.C لتنفيذ المشاريع وإدارتها تحت مظلة ”مكتب الإستشاري مروان أحمد ناظر قسم الإستشارات الهندسية، تصاميم، مساحة، إدارة مشاريع” وقد لاقت إستحسان من كل العملاء ولله الحمد."
                    : "Behind all these achievements was the dedicated effort of the General Manager, Eng. Marwan Ahmed Nazer, as the owner of this entity. MNC for project execution and management operates under the umbrella of 'Consultant Marwan Ahmed Nazer Office for Engineering Consultancy, Designs, Surveying, and Project Management,' and has received praise from all clients."}
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className={`flex items-start gap-3 sm:gap-4 ${lang === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                    <Target className="text-secondary" size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-base sm:text-lg text-primary mb-2">{lang === 'ar' ? 'هدفنا الأساسي' : 'Our Main Goal'}</h3>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                      {lang === 'ar'
                        ? "إيجاد الحلول المناسبة لزبائننا بغية الوصول إلى عمل متكامل حيث أننا وبعد أن يتم عمل التصاميم النهائية لأي مشروع يتم عرض فكرة التنفيذ على المالك... نقوم بتسليم المشروع متكاملاً آخذين بعين الاعتبار الجودة والسمعة الطيبة."
                        : "Finding appropriate solutions for our clients to achieve integrated work. After final designs for any project are completed, the execution concept is presented to the owner... we deliver the project integrated, taking into account quality and a good reputation."}
                    </p>
                  </div>
                </div>

                <div className={`flex items-start gap-3 sm:gap-4 ${lang === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                    <Building2 className="text-secondary" size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-base sm:text-lg text-primary mb-2">{lang === 'ar' ? 'مشاريعنا' : 'Our Projects'}</h3>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                      {lang === 'ar'
                        ? "لقد قمنا بتنفيذ وتطوير مشاريع عديدة وهناك مشاريع إستثمارية جاري العمل بها وهي على أعلى مستوى من ناحية التصميم أو التنفيذ."
                        : "We have executed and developed numerous projects, and there are investment projects currently in progress that are at the highest level in terms of design or execution."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Executive Director Section */}
      <section className="py-24 bg-[#eaeaea]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 lg:gap-16 items-center`}>
            {/* Image */}
            <div className={`relative w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[4/3] rounded-lg lg:rounded-sm overflow-hidden shadow-2xl ${lang === 'ar' ? 'order-last' : 'order-first'}`} data-aos={lang === 'ar' ? 'fade-left' : 'fade-right'}>
              <Image 
                src="/asstes/director_ar.png" 
                alt={lang === 'ar' ? "المدير التنفيذي المهندس مروان ناظر" : "CEO Eng. Marwan Nazer"}
                fill 
                className="object-cover" 
              />
            </div>

            {/* Text Content */}
            <div className={`space-y-6 lg:space-y-8 ${lang === 'ar' ? 'order-first text-right' : 'order-last text-left'}`} data-aos={lang === 'ar' ? 'fade-right' : 'fade-left'}>
              <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-800 font-heading mb-4">
                  {lang === 'ar' ? 'المدير التنفيذي' : 'Executive Director'}
                </h2>
                <div className={`w-16 h-1 bg-secondary ${lang === 'ar' ? 'mr-0 ml-auto lg:mr-0' : 'ml-0 mr-auto lg:ml-0'} mb-6 lg:mb-8`}></div>
                
                <div className="space-y-6 text-[15px] md:text-base leading-loose text-slate-700 font-medium">
                  <p>
                    {lang === 'ar'
                      ? "تعد شركة إم إن سي MNC لتطوير وتنفيذ المشاريع وإدارتها علامة متميزة في مجال البناء في مدينة جدة ، فلقد تميزت وخلال فترة وجيزة من إدارة وتنفيذ مشاريع عديدة ولله الحمد تكللت بالنجاح وكل هذا كان من منطلق الخطة التي وضعت من قبل خبراء متميزين ومتمرسي في هذا المجال الهام ،فلقد كان وراء كل هذه الإنجازات تكريس جهود من قبل المدير العام المهندس/ مروان أحمد ناظر بصفته صاحب هذا الكيان وتعمل شركة إم إن سي M.N.C لتنفيذ المشاريع وإدارتها تحت مظلة ” مكتب الإستشاري مروان أحمد ناظر قسم الإستشارات الهندسية ،تصاميم ،مساحة ،إدارة مشاريع ” وقد لاقت إستحسان من كل العملاء ولله الحمد ."
                      : "MNC Project Development and Management is a distinctive mark in the construction field in Jeddah. In a short period, it has successfully managed and executed numerous projects. All this was based on a plan developed by distinguished and experienced experts in this important field. Behind all these achievements was the dedicated effort of the General Manager, Eng. Marwan Ahmed Nazer, as the owner of this entity. MNC operates under the umbrella of 'Consultant Marwan Ahmed Nazer Office for Engineering Consultancy, Designs, Surveying, and Project Management' and has received praise from all clients."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="container mx-auto px-6 max-w-7xl mt-24">
          <div className="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-8 bg-secondary"></span>
              <span className="text-secondary font-bold tracking-widest uppercase text-xs">
                {lang === 'ar' ? 'فريق العمل' : 'Our Team'}
              </span>
              <span className="h-px w-8 bg-secondary"></span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-6 text-primary leading-tight">
              {lang === 'ar' ? (
                <>شركاء <span className="text-secondary">النجاح</span> والإبداع</>
              ) : (
                <>Partners of <span className="text-secondary">Success</span> & Creativity</>
              )}
            </h2>
            <p className="text-slate-500 text-base md:text-lg leading-relaxed">
              {lang === 'ar'
                ? "نفخر في مؤسسة مروان أحمد ناظر بامتلاكنا نخبة من أكفأ المهندسين والإداريين والفنيين، الذين يجمعهم الشغف والالتزام بتقديم أفضل الحلول الهندسية بأعلى معايير الجودة والاحترافية."
                : "At Marwan Ahmed Nazer, we take pride in having a group of the most efficient engineers, administrators, and technicians, united by passion and commitment to provide the best engineering solutions with the highest quality and professionalism standards."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 lg:gap-12">
            {/* Team Card 1 */}
            <div className="group relative rounded-xl lg:rounded-2xl overflow-hidden shadow-lg lg:shadow-xl border border-slate-100 bg-white" data-aos="fade-up" data-aos-delay="100">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src="/asstes/team1.png"
                  alt="MNC Team"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className={`absolute bottom-0 ${lang === 'ar' ? 'left-0 text-right' : 'right-0 text-left'} w-full p-4 sm:p-6 translate-y-6 sm:translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500`}>
                  <h3 className="text-white font-bold text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2">
                    {lang === 'ar' ? 'الكوادر الإدارية والهندسية' : 'Administrative & Engineering Staff'}
                  </h3>
                  <p className="text-secondary text-xs sm:text-sm md:text-base font-medium">
                    {lang === 'ar' ? 'خبرات متكاملة لإدارة مشاريعكم باحترافية' : 'Integrated expertise to manage your projects professionally'}
                  </p>
                </div>
              </div>
            </div>

            {/* Team Card 2 */}
            <div className="group relative rounded-xl lg:rounded-2xl overflow-hidden shadow-lg lg:shadow-xl border border-slate-100 bg-white" data-aos="fade-up" data-aos-delay="200">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src="/asstes/team2.png"
                  alt="MNC Team"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className={`absolute bottom-0 ${lang === 'ar' ? 'left-0 text-right' : 'right-0 text-left'} w-full p-4 sm:p-6 translate-y-6 sm:translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500`}>
                  <h3 className="text-white font-bold text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2">
                    {lang === 'ar' ? 'الفرق الميدانية والفنية' : 'Field & Technical Teams'}
                  </h3>
                  <p className="text-secondary text-xs sm:text-sm md:text-base font-medium">
                    {lang === 'ar' ? 'تنفيذ دقيق بأعلى معايير الجودة العالمية' : 'Precise execution to the highest international quality standards'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-secondary relative overflow-hidden">
        <div className="container relative z-10 mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 font-heading">
            {lang === 'ar' ? 'جاهزون لبناء رؤيتك القادمة' : 'Ready to build your next vision'}
          </h2>
          <Link href="/contact" className={`inline-flex items-center gap-2 bg-[#eaeaea] text-secondary px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-primary transition-all shadow-xl ${lang === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}>
            {lang === 'ar' ? 'تواصل معنا الآن' : 'Contact Us Now'}
            {lang === 'ar' ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
          </Link>
        </div>
      </section>
    </main>
  );
}
