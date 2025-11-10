import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EnhancedSEO } from "@/components/EnhancedSEO";

export default function AboutPage() {
  const [imgError, setImgError] = useState(false);

  return (
    <>
      <EnhancedSEO title="من نحن" description="EgyGo منصة مصرية للتسويق والتجارة الإلكترونية تربط التجّار والمسوقين والمستهلكين في منظومة واحدة ذكية وسهلة، مع رؤية لتمكين الدخل الرقمي للجميع." />
      <section className="bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-100 py-16 px-6 md:px-10">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-primary">من نحن</h1>
            <p className="text-lg leading-relaxed mb-8 text-muted-foreground">
              <strong className="text-foreground">EgyGo</strong> هي منصة تسويق إلكتروني مصرية تهدف إلى ربط التجّار، المسوقين، والمستهلكين في منظومة واحدة
              ذكية وسهلة الاستخدام. رؤيتنا هي تحويل التسويق بالعمولة إلى فرصة حقيقية لأي شخص يرغب في تحقيق دخل مستمر
              من الإنترنت بطريقة احترافية، شفافة، وسهلة.
            </p>

            <div className="my-10">
              {!imgError ? (
                <img
                  src="/assets/ceo-profile.jpg"
                  alt="Ibrahim Mamdouh Hassan"
                  className="w-32 h-32 mx-auto rounded-full shadow-lg ring-2 ring-primary/20 mb-4 object-cover"
                  onError={() => setImgError(true)}
                  loading="lazy"
                />
              ) : (
                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary to-purple-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg mb-4">
                  IMH
                </div>
              )}
              <h2 className="text-2xl font-bold">إبراهيم ممدوح حسن</h2>
              <p className="text-primary font-semibold mb-3">الرئيس التنفيذي (CEO)</p>
              <p className="text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                شاب مصري عمره 21 عامًا، يجمع بين شغف <strong>البرمجة، الطب، والذكاء الاصطناعي</strong>. أسّس
                <strong> EgyGo </strong>
                ليقدّم نموذجًا جديدًا في التجارة الإلكترونية قائمًا على الشفافية، التقنية، وفرص الربح الحقيقي للمجتمع المصري والعربي.
              </p>
            </div>

            <p className="text-lg leading-relaxed mb-10 text-muted-foreground">
              نؤمن أن النجاح في العصر الرقمي لا يحتاج رأس مال كبير، بل فكرة ذكية وتنفيذ دقيق. لذلك نعمل على تطوير أدوات متقدمة تتيح لأي شخص — مهما كانت خبرته — أن يبدأ عمله الإلكتروني بسهولة،
              ويصل إلى دخل مستقر باستخدام تقنيات الذكاء الاصطناعي والأتمتة الحديثة.
            </p>

            <div className="mt-10">
              <Button asChild size="lg" className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full shadow-lg transition-all">
                <a href="https://wa.me/201034324951" target="_blank" rel="noopener noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.02 2 11.5c0 2.06.7 3.98 1.88 5.53L2 22l5.12-1.63A9.91 9.91 0 0012 21c5.52 0 10-4.48 10-9.5S17.52 2 12 2zm0 17.5c-1.53 0-2.98-.37-4.28-1.05l-.3-.16-3.04.97.99-2.92-.2-.31A7.32 7.32 0 014.5 11.5c0-4.14 3.59-7.5 8-7.5s8 3.36 8 7.5-3.59 7.5-8 7.5z"/>
                  </svg>
                  تواصل معي على واتساب
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
