import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Share2, Facebook, Twitter, Linkedin, CheckCircle } from 'lucide-react';
import { getBlogBySlug, blogs } from '../../data/blogs';

export default function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const blog = getBlogBySlug(slug);

  // Get related blogs (same category or random if not enough)
  const relatedBlogs = blogs
    .filter(b => b.id !== blog?.id && b.category === blog?.category)
    .slice(0, 3);

  // If not enough related blogs in same category, add from other categories
  if (relatedBlogs.length < 3) {
    const additionalBlogs = blogs
      .filter(b => b.id !== blog?.id && !relatedBlogs.find(rb => rb.id === b.id))
      .slice(0, 3 - relatedBlogs.length);
    relatedBlogs.push(...additionalBlogs);
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog Not Found</h1>
          <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = blog.title;
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  const renderSection = (section, index) => {
    switch (section.type) {
      case 'intro':
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              {section.content}
            </p>
          </motion.div>
        );

      case 'numbered':
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            {section.image && (
              <div className="mb-6 rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={section.image}
                  alt={section.title}
                  className="w-full h-64 md:h-80 object-cover"
                />
              </div>
            )}
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              <span className="text-secondary-500">{section.number}.</span> {section.title}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {section.content}
            </p>
          </motion.div>
        );

      case 'heading':
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            {section.image && (
              <div className="mb-6 rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={section.image}
                  alt={section.title}
                  className="w-full h-64 md:h-80 object-cover"
                />
              </div>
            )}
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {section.title}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {section.content}
            </p>
          </motion.div>
        );

      case 'tips':
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-6 md:p-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              {section.title}
            </h2>
            <ul className="space-y-4">
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start gap-3">
                  <CheckCircle className="text-secondary-500 flex-shrink-0 mt-1" size={20} />
                  <span className="text-lg text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <section className="relative h-[50vh] md:h-[60vh]">
        <div className="absolute inset-0">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        </div>
        
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/blog')}
          className="absolute top-24 left-4 md:left-8 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-800 hover:bg-white transition-colors shadow-lg"
        >
          <ArrowLeft size={20} />
          <span className="hidden sm:inline">Back to Blog</span>
        </motion.button>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span 
                className="inline-block px-4 py-2 rounded-full text-sm font-semibold text-white mb-4"
                style={{ backgroundColor: blog.categoryColor }}
              >
                {blog.category}
              </span>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                {blog.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/80">
                <span className="flex items-center gap-2">
                  <Calendar size={16} />
                  {blog.date}
                </span>
                <span className="flex items-center gap-2">
                  <Clock size={16} />
                  {blog.readTime}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Share Buttons */}
          <div className="flex items-center gap-4 mb-10 pb-8 border-b border-gray-200">
            <span className="flex items-center gap-2 text-gray-600">
              <Share2 size={18} />
              Share:
            </span>
            <button
              onClick={() => handleShare('facebook')}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              aria-label="Share on Facebook"
            >
              <Facebook size={18} />
            </button>
            <button
              onClick={() => handleShare('twitter')}
              className="p-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors"
              aria-label="Share on Twitter"
            >
              <Twitter size={18} />
            </button>
            <button
              onClick={() => handleShare('linkedin')}
              className="p-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors"
              aria-label="Share on LinkedIn"
            >
              <Linkedin size={18} />
            </button>
          </div>

          {/* Blog Sections */}
          <article>
            {blog.sections && blog.sections.map((section, index) => renderSection(section, index))}
          </article>
        </div>
      </section>

      {/* Related Blogs */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            Related Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedBlogs.map((relatedBlog, index) => (
              <motion.article
                key={relatedBlog.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-gray-50 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                <Link to={`/blog/${relatedBlog.slug}`} className="block">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={relatedBlog.image}
                      alt={relatedBlog.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-5">
                    <span 
                      className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white mb-3"
                      style={{ backgroundColor: relatedBlog.categoryColor }}
                    >
                      {relatedBlog.category}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {relatedBlog.title}
                    </h3>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-white/90 mb-8">
            Explore our curated tours and create unforgettable memories.
          </p>
          <Link
            to="/tours"
            className="inline-flex items-center gap-2 px-8 py-4 bg-secondary-500 text-white font-semibold rounded-full hover:bg-secondary-600 transition-colors shadow-lg hover:shadow-xl"
          >
            Browse Tours
            <ArrowLeft size={20} className="rotate-180" />
          </Link>
        </div>
      </section>
    </div>
  );
}
