import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Users, Building2, Target } from "lucide-react";
import Navbar from "@/components/layout/Navbar";


export const metadata = {
  title: "من نحن – MNC",
  description: "تعرف على شركة إم إن سي لتطوير وتنفيذ المشاريع وإدارتها.",
};

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2071&auto=format&fit=crop"
            alt="About Us Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="container relative z-10 mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 font-heading">
              تعرف علينا
              <span className="block text-secondary mt-2">إم إن سي للمقاولات</span>
            </h1>
            <p className="text-xl text-white/80 leading-relaxed font-semibold">
              علامة متميزة في مجال البناء وتطوير المشاريع وإدارتها في مدينة جدة.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-20 bg-white text-slate-900">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image Grid */}
            <div className="grid grid-cols-2 gap-4" data-aos="fade-left">
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
            <div className="space-y-8" data-aos="fade-right">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-primary font-heading relative inline-block">
                  رؤيتنا وتاريخنا
                  <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-secondary rounded-full"></div>
                </h2>
                <p className="text-lg leading-relaxed text-slate-600 font-medium">
                  تعد شركة <span className="font-bold text-primary">إم إن سي MNC</span> لتطوير وتنفيذ المشاريع وإدارتها علامة متميزة في مجال البناء في مدينة جدة، فلقد تميزت وخلال فترة وجيزة من إدارة وتنفيذ مشاريع عديدة ولله الحمد تكللت بالنجاح. وكل هذا كان من منطلق الخطة التي وضعت من قبل خبراء متميزين ومتمرسين في هذا المجال الهام.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border-r-4 border-secondary shadow-sm">
                <p className="text-lg leading-relaxed text-slate-700 font-medium">
                  لقد كان وراء كل هذه الإنجازات تكريس جهود من قبل المدير العام المهندس/ مروان أحمد ناظر بصفته صاحب هذا الكيان. وتعمل شركة إم إن سي M.N.C لتنفيذ المشاريع وإدارتها تحت مظلة ”مكتب الإستشاري مروان أحمد ناظر قسم الإستشارات الهندسية، تصاميم، مساحة، إدارة مشاريع” وقد لاقت إستحسان من كل العملاء ولله الحمد.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                    <Target className="text-secondary" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-primary mb-2">هدفنا الأساسي</h3>
                    <p className="text-slate-600 leading-relaxed">
                      إيجاد الحلول المناسبة لزبائننا بغية الوصول إلى عمل متكامل حيث أننا وبعد أن يتم عمل التصاميم النهائية لأي مشروع يتم عرض فكرة التنفيذ على المالك... نقوم بتسليم المشروع متكاملاً آخذين بعين الاعتبار الجودة والسمعة الطيبة.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                    <Building2 className="text-secondary" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-primary mb-2">مشاريعنا</h3>
                    <p className="text-slate-600 leading-relaxed">
                      لقد قمنا بتنفيذ وتطوير مشاريع عديدة وهناك مشاريع إستثمارية جاري العمل بها وهي على أعلى مستوى من ناحية التصميم أو التنفيذ.
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image */}
            <div className="relative w-full aspect-[4/3] rounded-sm overflow-hidden shadow-2xl order-last" data-aos="fade-left">
              <Image 
                src="/asstes/director_ar.png" 
                alt="المدير التنفيذي المهندس مروان ناظر" 
                fill 
                className="object-cover" 
              />
            </div>

            {/* Text Content */}
            <div className="space-y-8 order-first" data-aos="fade-right">
              <div className="text-center lg:text-right">
                <h2 className="text-3xl md:text-4xl font-black text-slate-800 font-heading mb-4">
                  المدير التنفيذي
                </h2>
                <div className="w-20 h-1 bg-secondary mx-auto lg:mx-0 mb-8"></div>
                
                <div className="space-y-6 text-[15px] md:text-base leading-loose text-slate-700 font-medium text-justify">
                  <p>
                    تعد شركة <span className="font-bold text-slate-800">إم إن سي MNC</span> لتطوير وتنفيذ المشاريع وإدارتها علامة متميزة في مجال البناء في مدينة جدة ، فلقد تميزت وخلال فترة وجيزة من إدارة وتنفيذ مشاريع عديدة ولله الحمد تكللت بالنجاح وكل هذا كان من منطلق الخطة التي وضعت من قبل خبراء متميزين ومتمرسي في هذا المجال الهام ،فلقد كان وراء كل هذه الإنجازات تكريس جهود من قبل المدير العام المهندس/ مروان أحمد ناظر بصفته صاحب هذا الكيان وتعمل شركة إم إن سي M.N.C لتنفيذ المشاريع وإدارتها تحت مظلة ” مكتب الإستشاري مروان أحمد ناظر قسم الإستشارات الهندسية ،تصاميم ،مساحة ،إدارة مشاريع ” وقد لاقت إستحسان من كل العملاء ولله الحمد .
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
            جاهزون لبناء رؤيتك القادمة
          </h2>
          <Link href="/#contact" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-primary transition-all shadow-xl">
            تواصل معنا الآن
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>


    </main>
  );
}
