"use client"

import React, { useState } from 'react';

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="border p-4 mb-4 cursor-pointer rounded" onClick={() => setIsVisible(!isVisible)}>
      <h3
        className="text-lg font-medium"
      >
        {question}
      </h3>
      {isVisible && <p className="faq-answer mt-2 ml-5">{answer}</p>}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Question",
          "name": question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": answer
          }
        })}
      </script>
    </div>
  );
};

const FAQSection = ({ faqs }: { faqs: { question: string; answer: string }[] }) => {
  return (
    <div>
      {faqs.length > 0 && <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>}
      {faqs.map((faq, index) => (
        <FAQItem key={index} {...faq} />
      ))}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        })}
      </script>
    </div>
  );
};

export default FAQSection;
