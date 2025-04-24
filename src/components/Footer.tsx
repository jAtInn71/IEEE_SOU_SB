
import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, MapPin, Mail, Phone, Twitter } from "lucide-react";
import { SocialLink } from "@/types";

const SOCIAL_LINKS: SocialLink[] = [
  {
    platform: "Instagram",
    url: "https://www.instagram.com/ieee_silveroakuni/",
    icon: Instagram
  },
  {
    platform: "Twitter",
    url: "https://twitter.com/IEEE_SilverOak",
    icon: Twitter
  },
  {
    platform: "Facebook",
    url: "https://www.facebook.com/IEEESilverOakUni",
    icon: Facebook
  },
  {
    platform: "LinkedIn",
    url: "https://www.linkedin.com/company/ieee-silveroakuni/",
    icon: Linkedin
  }
];

export default function Footer() {
  return (
    <footer className="bg-primary/5 py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
          {/* Logo and description */}
          <div>
            <Link to="/" className="inline-block mb-4">
              {/* IMPORTANT: Replace this with dark mode logo when available */}
              <img
                src="http://ieee.socet.edu.in/wp-content/uploads/2025/03/ieee_sou_sb_logo-removebg-preview.png"
                alt="IEEE SOU SB Logo"
                className="h-10 md:h-16 w-auto"
              />
            </Link>
            <p className="text-xs md:text-sm text-muted-foreground max-w-md">
              Silver Oak University IEEE SB aims to give an interactive platform for students to 
              develop professional and technical abilities. Since the start, it is successfully 
              organizing various events with well-defined subjects.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Contact Us</h3>
            <div className="space-y-2 md:space-y-3">
              <div className="flex items-start">
                <Phone className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-xs md:text-sm text-muted-foreground">+91 79660 46304</span>
              </div>
              <div className="flex items-center">
  <Mail className="h-4 w-4 md:h-5 md:w-5 mr-3 text-primary flex-shrink-0" />
  <div className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors space-y-1">
    <a href="mailto:ieee.fbc@socet.edu.in" className="block hover:text-primary">
      ieee.fbc@socet.edu.in
    </a>
    <a href="mailto:ieee.sc@socet.edu.in" className="block hover:text-primary">
      ieee.sc@socet.edu.in
    </a>
    <a href="mailto:ieee.tr@socet.edu.in" className="block hover:text-primary">
      ieee.tr@socet.edu.in
    </a>
  </div>
</div>

              <div className="flex items-start">
                <MapPin className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-xs md:text-sm text-muted-foreground">
                  Silver Oak University, Nr. Bhavik Publications, Opp. Bhagwat Vidyapith, S.G.Highway,
                  Ahmedabad, Gujarat - 382481
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-4 md:mt-6">
              <h4 className="text-xs md:text-sm font-semibold mb-2 md:mb-3">Follow Us</h4>
              <div className="flex space-x-4">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={`Follow us on ${social.platform}`}
                  >
                    <social.icon className="h-4 w-4 md:h-5 md:w-5" />
                  </a>
                ))}
                <a
                  href="https://www.threads.net/@ieee_silveroakuni"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Follow us on Threads"
                >
                  <svg className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.186 24h-.007c-3.581-.024-5.687-1.569-6.446-4.753C5.141 16.5 4.69 13.148 4.5 11.486c0-.24.219-.435.47-.435l.27.015c3.55.327 7.03-1.389 8.386-4.193.626-1.293.932-2.703.905-4.128C14.254 1.363 15.652 0 17.02 0h.942c1.127 0 2.152.747 2.48 1.86.473 1.602.454 3.214-.063 4.593-.81 2.146-2.107 3.932-3.692 5.235 0 0 .662 3.537 2.608 4.157.738.245 1.079 1.088.737 1.809-.334.7-1.14.985-1.826.638-2.878-1.43-3.115-5.251-3.328-7.447.031-.106.05-.216.05-.336 0-.643-.526-1.17-1.163-1.17-.638 0-1.162.527-1.162 1.17 0 .018 0 .035.002.054-.028 0-.028 9.95 5.872 9.95.168 0 .342-.012.512-.03.626-.073 1.21.372 1.282 1.01.072.65-.347 1.231-.97 1.303-.273.034-.565.054-.86.054z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-4 md:pt-6 border-t border-border/50 text-center">
          <p className="text-xs md:text-sm text-muted-foreground">
            &copy; Copyright Silver Oak University IEEE SB. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
