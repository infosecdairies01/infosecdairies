import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-4">
            <a
              href="https://www.linkedin.com/company/blueteamers/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-full bg-muted/50 hover:bg-[#0077B5]/20 transition-colors group"
              aria-label="LinkedIn"
            >
              <img src="https://cdn-icons-png.flaticon.com/512/4138/4138130.png" alt="LinkedIn" className="w-6 h-6 group-hover:text-[#0077B5] transition-colors" />
            </a>
            <a
              href="https://www.instagram.com/blueteamers_?igsh=MW9vdHJicHZvOGZxYg%3D%3D&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-muted/50 hover:bg-[#E4405F]/20 transition-colors group flex items-center justify-center"
              aria-label="Instagram"
            >
              <img src="https://static.vecteezy.com/system/resources/previews/018/930/413/non_2x/instagram-logo-instagram-icon-transparent-free-png.png" alt="Instagram" className="w-10 h-10 group-hover:text-[#E4405F] transition-colors" />
            </a>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <span>|</span>
            <Link to="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <span>|</span>
            <Link to="/disclaimer" className="hover:text-primary transition-colors">
              Disclaimer
            </Link>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} BlueTeamers. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
