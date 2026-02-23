import { motion } from "framer-motion";

const references = [
  "B. Pang and L. Lee, \"Opinion Mining and Sentiment Analysis,\" Foundations and Trends® in Information Retrieval, 2008.",
  "A. Go, R. Bhayani, and L. Huang, \"Twitter Sentiment Classification Using Distant Supervision,\" Stanford University, 2009.",
  "A. Pak and P. Paroubek, \"Twitter as a Corpus for Sentiment Analysis and Opinion Mining,\" LREC, 2010.",
  "V. A. Kharde and S. S. Sonawane, \"Sentiment Analysis of Twitter Data: A Survey of Techniques,\" arXiv, 2016.",
  "B. Liu, Sentiment Analysis and Opinion Mining, Morgan & Claypool, 2012.",
  "S. M. Mohammad et al., \"NRC-Canada: Sentiment Analysis of Tweets,\" SemEval, 2013.",
  "T. Joachims, \"Text Categorization with Support Vector Machines,\" ECML, 1998.",
  "A. McCallum and K. Nigam, \"A Comparison of Event Models for Naive Bayes Text Classification,\" AAAI, 1998.",
  "Y. Zhang et al., \"Understanding Bag-of-Words Model,\" IJMLC, 2010.",
  "J. Leskovec et al., Mining of Massive Datasets, Cambridge Univ. Press, 2014.",
  "C. D. Manning et al., Introduction to Information Retrieval, Cambridge University Press, 2008.",
  "S. Bird et al., Natural Language Processing with Python, O'Reilly Media, 2009.",
  "S. Minaee et al., \"Deep Learning-Based Text Classification: A Review,\" ACM Computing Surveys, 2021.",
  "J. Wiebe et al., \"Annotating Opinions and Emotions,\" Language Resources and Evaluation, 2005.",
  "E. Cambria et al., \"SenticNet 3,\" AAAI, 2014.",
  "E. Cambria, \"Affective Computing and Sentiment Analysis,\" IEEE Intelligent Systems, 2016.",
  "N. J. Sanders, \"Twitter Sentiment Corpus,\" 2011.",
  "K. Ravi and V. Ravi, \"A Survey on Opinion Mining,\" Knowledge-Based Systems, 2015.",
  "A. Onan, \"Sentiment Analysis on Social Media,\" Expert Systems with Applications, 2021.",
  "J. Devlin et al., \"BERT: Pre-training of Deep Bidirectional Transformers,\" NAACL, 2019.",
  "S. Rosenthal et al., \"SemEval-2017 Task 4: Sentiment Analysis in Twitter,\" 2017.",
  "F. Bravo-Marquez et al., \"Meta-level Sentiment Models,\" Information Sciences, 2014.",
];

const ReferencesSection = () => {
  return (
    <section id="references" className="py-24 px-6 bg-card/30">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">References</h2>
          <div className="section-glow-line mb-8" />

          <ol className="space-y-3">
            {references.map((ref, i) => (
              <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                <span className="text-primary font-mono shrink-0">[{i + 1}]</span>
                <span>{ref}</span>
              </li>
            ))}
          </ol>
        </motion.div>
      </div>
    </section>
  );
};

export default ReferencesSection;
