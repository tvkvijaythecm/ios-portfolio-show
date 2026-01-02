UPDATE info_app_settings 
SET 
  privacy_html_content = '<div style="padding: 20px; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
    <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px;">Privacy Policy</h1>
    <p style="margin-bottom: 12px; line-height: 1.6;">Last updated: January 2025</p>
    
    <h2 style="font-size: 18px; font-weight: 600; margin: 20px 0 12px;">1. Information We Collect</h2>
    <p style="margin-bottom: 12px; line-height: 1.6;">We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.</p>
    
    <h2 style="font-size: 18px; font-weight: 600; margin: 20px 0 12px;">2. How We Use Your Information</h2>
    <p style="margin-bottom: 12px; line-height: 1.6;">We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
    
    <h2 style="font-size: 18px; font-weight: 600; margin: 20px 0 12px;">3. Data Security</h2>
    <p style="margin-bottom: 12px; line-height: 1.6;">We implement appropriate security measures to protect your personal information against unauthorized access, alteration, or destruction.</p>
    
    <h2 style="font-size: 18px; font-weight: 600; margin: 20px 0 12px;">4. Contact Us</h2>
    <p style="margin-bottom: 12px; line-height: 1.6;">If you have any questions about this Privacy Policy, please contact us through the app.</p>
  </div>',
  license_html_content = '<div style="padding: 20px; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
    <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px;">GNU Affero General Public License v3.0</h1>
    
    <p style="margin-bottom: 16px; line-height: 1.6; font-style: italic;">Version 3, 19 November 2007</p>
    
    <h2 style="font-size: 18px; font-weight: 600; margin: 20px 0 12px;">Preamble</h2>
    <p style="margin-bottom: 12px; line-height: 1.6;">The GNU Affero General Public License is a free, copyleft license for software and other kinds of works, specifically designed to ensure cooperation with the community in the case of network server software.</p>
    
    <h2 style="font-size: 18px; font-weight: 600; margin: 20px 0 12px;">Terms and Conditions</h2>
    <p style="margin-bottom: 12px; line-height: 1.6;"><strong>0. Definitions.</strong> "This License" refers to version 3 of the GNU Affero General Public License.</p>
    <p style="margin-bottom: 12px; line-height: 1.6;"><strong>1. Source Code.</strong> The "source code" for a work means the preferred form of the work for making modifications to it.</p>
    <p style="margin-bottom: 12px; line-height: 1.6;"><strong>2. Basic Permissions.</strong> All rights granted under this License are granted for the term of copyright on the Program, and are irrevocable provided the stated conditions are met.</p>
    
    <h2 style="font-size: 18px; font-weight: 600; margin: 20px 0 12px;">How to Apply These Terms</h2>
    <p style="margin-bottom: 12px; line-height: 1.6;">If you develop a new program, and you want it to be of the greatest possible use to the public, the best way to achieve this is to make it free software which everyone can redistribute and change under these terms.</p>
    
    <p style="margin-top: 24px; padding: 12px; background: rgba(0,0,0,0.05); border-radius: 8px; font-size: 14px;">For the complete license text, visit: <a href="https://www.gnu.org/licenses/agpl-3.0.html" style="color: #0066cc;">gnu.org/licenses/agpl-3.0.html</a></p>
  </div>'
WHERE id IS NOT NULL;