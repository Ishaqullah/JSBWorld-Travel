import { useEffect } from 'react';

export default function CookiesPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-center mb-6">
          <span className="text-gradient">Cookies Policy</span>
        </h1>
        <p className="text-lg text-gray-600 text-center mb-12">
          Understanding how we use cookies and file activity on our website.
        </p>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
          
          {/* What Are Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">What Are Cookies?</h2>
            <p className="text-gray-700 mb-4">
              Cookies are small files that are downloaded to your computer or device when you access our website. They enable us to store and retrieve information about your browsing habits and your device, depending on the content of the cookies and how you use your computer. Cookies can also help in recognizing users.
            </p>
            <p className="text-gray-700 mb-4">
              JSBWORLD-TRAVEL, either directly or through third-party partners contracted to provide measurement services, may utilize cookies when users browse our website and its pages. These cookies are sent to a browser by a web server to log user activities on the site.
            </p>
            <p className="text-gray-700">
              Cookies used by www.jsbworld-travel.com/, or by third parties acting on our behalf, are associated only with anonymous users and their devices and do not provide any personal data.
            </p>
          </section>

          {/* How We Use Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">How We Use Cookies</h2>
            <p className="text-gray-700 mb-4">
              With the help of cookies, the server at www.jsbworld-travel.com/, or its third-party partners, can identify the browser used by the user, making navigation easier. This allows, for example, previously registered users to access specific areas, services, promotions, or contests without needing to log in each time. Cookies also assist in measuring audience engagement, traffic parameters, and tracking visits.
            </p>
            <p className="text-gray-700">
              Moreover, web servers at www.jsbworld-travel.com/ can automatically detect the user's IP address and domain name. This information is logged on the server, allowing for subsequent data processing to generate statistical measurements, such as the number of page views and visits to web services. Any collected information is subjected to processes that anonymize the data to prevent identification of the user's machine.
            </p>
          </section>

          {/* Types of Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">What Types of Cookies Are Used on Our Website?</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Own Cookies</h3>
                <p className="text-gray-700">
                  These are cookies sent to your computer or device from our website. We use them to manage sessions and facilitate safe, anonymous transactions when booking trips with us.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Third-Party Cookies</h3>
                <p className="text-gray-700">
                  These cookies are sent to your computer or device from a domain or website not managed by us but by another entity that processes data obtained through cookies.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Session Cookies</h3>
                <p className="text-gray-700">
                  These temporarily collect and store data while you are using our website.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Persistent Cookies</h3>
                <p className="text-gray-700">
                  This type of cookie stores data on your device for a specified period, ranging from a few minutes to several years, allowing continued access to that data.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Analytics Cookies</h3>
                <p className="text-gray-700">
                  These cookies, either held by us or by third parties, help us quantify the number of users and perform statistical analysis of how users engage with our website. We utilize these cookies to analyze user navigation to enhance our product offerings and services.
                </p>
              </div>
            </div>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">Third-Party Analytics Services</h2>
            
            <div className="space-y-4">
              <div className="border-l-4 border-blue-400 pl-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Google Analytics</h3>
                <p className="text-gray-700">
                  We employ Google Analytics to collect information anonymously and report on website trends without identifying individual users. This means our website can remember certain details that may change its appearance or behavior, such as your preferred language or regional location. The provider of this cookie is Google.
                </p>
              </div>

              <div className="border-l-4 border-green-400 pl-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Google AdWords</h3>
                <p className="text-gray-700">
                  We also use Google AdWords to collect information anonymously and report on visits resulting from Google AdWords advertisements without identifying individual users. Our website sends data to Google to report on the effectiveness of market campaigns. The provider of this cookie is Google.
                </p>
              </div>

              <div className="border-l-4 border-indigo-400 pl-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Facebook</h3>
                <p className="text-gray-700">
                  Additionally, we use Facebook to gather information anonymously and report on visits resulting from Facebook advertisements without identifying individual users. Our website transmits information to Facebook to provide insights on marketing campaigns. The provider of this cookie is Facebook.
                </p>
              </div>
            </div>
          </section>

          {/* Managing Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">Managing Cookies</h2>
            <p className="text-gray-700 mb-4">
              You have the option to allow, block, or delete cookies installed on your computer by adjusting your browser settings.
            </p>
            <p className="text-gray-700 mb-4">
              For more information on managing cookies in various browsers, please refer to the following links:
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <a 
                href="http://support.mozilla.org/es/products/firefox/cookies" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-2xl">🦊</span>
                <span className="text-secondary-600 font-medium hover:underline">Firefox</span>
              </a>
              
              <a 
                href="http://support.google.com/chrome/bin/answer.py?hl=es&answer=95647" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-2xl">🌐</span>
                <span className="text-secondary-600 font-medium hover:underline">Chrome</span>
              </a>
              
              <a 
                href="http://windows.microsoft.com/es-es/windows7/how-to-manage-cookies-in-internet-explorer-9" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-2xl">🔷</span>
                <span className="text-secondary-600 font-medium hover:underline">Internet Explorer</span>
              </a>
              
              <a 
                href="http://support.apple.com/kb/ph5042" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-2xl">🍎</span>
                <span className="text-secondary-600 font-medium hover:underline">Safari</span>
              </a>
              
              <a 
                href="http://help.opera.com/Windows/12.00/esES/cookies.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-2xl">🔴</span>
                <span className="text-secondary-600 font-medium hover:underline">Opera</span>
              </a>
            </div>
          </section>

          {/* Contact Information */}
          <section className="border-t pt-8 mt-8">
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">Contact Us</h2>
            <p className="text-gray-700">
              If you have any questions about our Cookies Policy, please contact us at:{' '}
              <a href="mailto:info@jsbworld-travel.com" className="text-secondary-500 hover:underline">
                info@jsbworld-travel.com
              </a>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
