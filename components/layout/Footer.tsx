import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = {
    information: [
      { label: 'How to Order', href: '/how-to-order' },
      { label: 'How to Pay', href: '/how-to-pay' },
      { label: 'Terms of Conditions of Use', href: '/terms' },
      { label: 'Secure Connections and Privacy Notice', href: '/privacy' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Discreet Packaging', href: '/discreet-packaging' },
      { label: 'Shipping Rates (Refund and Returns)', href: '/shipping' },
      { label: 'Wholesale', href: '/wholesale' },
      { label: 'GDPR', href: '/gdpr' },
    ],
    aboutSteroids: [
      { label: 'Descriptions of Medicaments', href: '/descriptions' },
      { label: 'Side Effects of Anabolic Steroids', href: '/side-effects' },
      { label: 'Toxicity of Oral Steroids', href: '/toxicity' },
      { label: 'Steroids Half-Life', href: '/half-life' },
      { label: 'Application of AIS', href: '/ais' },
    ],
    storeInfo: [
      { label: 'Steroids4u.eu - Best EU Online Steroid Shop', href: '/' },
      { label: 'Buy anabolic steroids online', href: '/products' },
      { label: 'Customer Service 24/7', href: '/contact' },
      { label: 'About Us', href: '/about' },
      { label: 'Sitemap', href: '/sitemap' },
    ],
  };

  const socialLinks = [
    { icon: 'facebook', href: 'https://facebook.com/steroids4u.eu', label: 'Facebook' },
    { icon: 'twitter', href: 'https://twitter.com/Steroids4U_eu', label: 'Twitter' },
    { icon: 'instagram', href: 'https://instagram.com/steroids4u.eu_', label: 'Instagram' },
    { icon: 'tiktok', href: 'https://tiktok.com/@steroids4u.eu', label: 'TikTok' },
  ];

  const whyChooseUs = [
    { icon: '🌍', text: 'Fast Worldwide Shipping - We ship all over the world from EU!' },
    { icon: '⭐', text: '5 star reviews. You know you can trust us.' },
    { icon: '💳', text: 'Pay with your Domestic Bank account. More options available at checkout.' },
    { icon: '✅', text: 'Authenticity: All products on this website are genuine.' },
  ];

  return (
    <footer className="bg-black text-white">
      {/* Decorative Top Border */}
      <div className="h-2 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400" style={{
        backgroundImage: 'repeating-linear-gradient(45deg, #FBBF24, #FBBF24 10px, #000 10px, #000 20px)'
      }} />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Information Section */}
          <div>
            <h4 className="text-yellow-400 font-bold text-sm mb-6 uppercase tracking-wider">Information</h4>
            <ul className="space-y-3">
              {footerSections.information.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Using Steroids Section */}
          <div>
            <h4 className="text-yellow-400 font-bold text-sm mb-6 uppercase tracking-wider">About Using Steroids</h4>
            <ul className="space-y-3">
              {footerSections.aboutSteroids.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Store Information Section */}
          <div>
            <h4 className="text-yellow-400 font-bold text-sm mb-6 uppercase tracking-wider">Store Information</h4>
            <ul className="space-y-3">
              {footerSections.storeInfo.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials & Why Choose Us */}
          <div>
            {/* Socials */}
            <div className="mb-8">
              <h4 className="text-yellow-400 font-bold text-sm mb-4 uppercase tracking-wider">Socials</h4>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-yellow-400 transition-colors"
                    aria-label={social.label}
                  >
                    {social.icon === 'facebook' && (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    )}
                    {social.icon === 'twitter' && (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 002.856-3.915 10 10 0 01-2.856.973 5 5 0 00-8.66 4.59 14.23 14.23 0 01-10.337-5.196 5 5 0 001.551 6.759 5 5 0 01-2.265-.567v.06a5 5 0 004.001 4.9 5 5 0 01-2.26.086 5 5 0 004.678 3.488 10.02 10.02 0 01-6.177 2.132c-.398 0-.79-.023-1.175-.067a14.201 14.201 0 007.713 2.262c9.256 0 14.336-7.662 14.336-14.322 0-.218-.005-.436-.015-.653a10.23 10.23 0 002.516-2.61z" />
                      </svg>
                    )}
                    {social.icon === 'instagram' && (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                      </svg>
                    )}
                    {social.icon === 'tiktok' && (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.1 1.82 2.89 2.89 0 0 1 5.1-1.82V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.96-.1z" />
                      </svg>
                    )}
                  </a>
                ))}
              </div>
            </div>

            {/* Why Choose Us */}
            <div>
              <h4 className="text-yellow-400 font-bold text-sm mb-4 uppercase tracking-wider">Why Steroids4u.eu ?</h4>
              <ul className="space-y-3">
                {whyChooseUs.map((item, index) => (
                  <li key={index} className="flex gap-2 text-xs text-gray-300">
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <p className="text-gray-500 text-xs text-center">
            © {currentYear} Steroids4u.eu. All rights reserved. |
            <Link href="/privacy" className="hover:text-yellow-400 ml-1">Privacy Policy</Link> |
            <Link href="/terms" className="hover:text-yellow-400 ml-1">Terms & Conditions</Link> |
            <Link href="/disclaimer" className="hover:text-yellow-400 ml-1">Disclaimer</Link>
          </p>
          <p className="text-gray-600 text-xs text-center mt-4">
            Disclaimer: This is not a Pharmacy. All products are for research and scientific purposes only.
          </p>
        </div>
      </div>

      {/* Logos and Trust Section */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            {/* Left - Steroids4u Logo */}
            <div className="flex-shrink-0">
              <Image
                src="/s4u-logo2.webp"
                alt="Steroids4u Logo"
                width={200}
                height={80}
                className="h-16 w-auto"
                priority
              />
            </div>

            {/* Right - Trust Text */}
            <div className="flex-1 text-right">
              <p className="text-gray-700 text-sm">
                Trusted by thousands of customers worldwide. We provide authentic products with fast and discreet shipping.
              </p>
            </div>
          </div>

          {/* Copyright and Legal Text */}
          <div className="border-t border-gray-200 pt-8 space-y-6">
            {/* Main Copyright */}
            <p className="text-gray-700 text-xs leading-relaxed">
              Copyright © 2025 Steroids4U.eu – Steroids4U.net | ALL RIGHTS RESERVED | All content within is copyright protected | All photos, prices and texts on the site Steroids4U.eu – Best EU Online Steroid Shop have only informative character | Trusted Online supplier of high quality, genuine and reliable anabolic steroids and informations about it | All products are real and available | Buy steroids online | We Build Your Body
            </p>

            {/* Main Disclaimer */}
            <p className="text-gray-700 text-xs leading-relaxed">
              <strong>Disclaimer:</strong> This is not a Pharmacy! If you are under 18 years old (in some countries 21 years old) please leave this page! We do not support the sale and production of illegal substances and drugs without prescription. Anyone can voluntarily decide to choose our products. We assume no responsibility for incorrect use of these products. The information presented here should not be considered medical recommendation in any way. All prices, texts, photos and logos used on this website are from public internet and have only informative character. Website Steroids4U.eu do not wants harming copyrights and logos of producers. Legalities regarding anabolic steroids, growth hormone, and other performance related drugs vary from state, province or country. If these drugs are illegal according to the laws governing, please do not engage in their use. Products on our website are not intended to diagnose, treat, cure or prevent any disease. These statements have not been evaluated by the Food and Drug Administration. Our website and the domain name "Steroids4U.eu" is representative of products (dietary supplements) that may enhance blood levels of steroid hormones in the body. This product is not to be used by anyone 18 years of age or younger. Use under a doctors supervision. Use in conjunction with a well balanced diet and an intense bodybuilding or exercise program. The goods offered by the seller through an online store is exclusively for research and scientific purposes. The goods offered by the Seller is a chemical that may not be used for human or animal, such as food, food additives, drugs, medical devices, cosmetics for humans or animals.
            </p>

            {/* Research Purposes Section */}
            <div>
              <p className="text-gray-700 text-xs font-semibold mb-3">Some products are designed for research and laboratory purposes only:</p>
              <ul className="text-gray-700 text-xs leading-relaxed space-y-3 list-disc list-inside">
                <li>The goods offered by the seller by means of online store are designed for research and scientific purposes only. The goods offered by the seller represent chemical substances that must not be used for people or animals, as foodstuff, food additives, drugs, medical devices, cosmetics for people or animals.</li>
                <li>No product offered by the seller can be considered a meal, food additive, drug, nutrient, cosmetics or other substance designed for people or animals. No product can be used for diagnostic or therapeutic purposes.</li>
                <li>The buyer declares that he has been properly instructed on the fact that the goods must not be used for other than scientific and research purposes and that the goods are not intended for people or animals, cannot be used as foodstuff, food additives, drugs, medical devices, cosmetics for people or animals or for business purposes.</li>
                <li>The buyer notes that there are certain risks associated with the handling, use, export, import and distribution of the goods.</li>
                <li>The buyer declares that he will test, use, import, export, distribute and place on the market the goods only in compliance with the relevant legislation of the given state, these business terms and conditions and experience acquired in this field. The buyer declares that he will not use the goods for other than research and scientific purposes.</li>
                <li>The buyer declares that only qualified and properly trained persons will be handling the goods.</li>
                <li>The seller buys, uses, imports, exports, distributes and performs any other research with the goods at his own risk. The seller is not liable for eventual damage that can be used by incorrect use of the goods, negligence, misuse or any other unforeseeable circumstance, regardless of whether the buyer or a third party claims them under the purchase contract, liability for damage or other</li>
              </ul>
            </div>

            {/* Final Notes */}
            <p className="text-gray-700 text-xs leading-relaxed">
              <strong>Steroids4U.eu</strong>
            </p>
            <p className="text-gray-700 text-xs leading-relaxed">
              The domain owner is not responsible for the content of these sites and is not the owner of them.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

