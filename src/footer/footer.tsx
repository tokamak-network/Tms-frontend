import React from 'react';
import discordLogo from '../../images/discord_icon.png';
import githubLogo from '../../images/github_logo.png';
import mediumLogo from '../../images/medium_logo.png';
import tgLogo from '../../images/tg_logo.png';
import XLogo from '../../images/xlogo.png';
import LinkedinLogo from '../../images/linkedinLogo.png';
import emailLogo from '../../images/emailLogo.webp';

const Footer = () => {
  return (
    <footer className="  bg-white w-full py-4 px-2 lg:px-4 border-t mt-auto relative">
      <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center text-xs sm:text-sm lg:text-base">
        <div className="text-left flex items-center space-x-1 lg:space-x-2 mb-2 lg:mb-0">
          <img
            src={emailLogo.src}
            alt="Email Logo"
            className="h-4 w-4 sm:h-5 sm:w-5 lg:h-7 lg:w-7 inline"
          />
          <a href="mailto:hello@tokamak.network" className="text-grey-600 hover:text-blue-800">
            hello@tokamak.network
          </a>
        </div>
        <div className="text-center mb-2 lg:mb-0">
          Copyright © 2024{' '}
          <a
            href="https://www.tokamak.network/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            Tokamak Network
          </a>{' '}
          All Rights Reserved.
        </div>
        <div className="flex flex-wrap justify-center space-x-3 sm:space-x-4 lg:space-x-5">
          <a href="https://x.com/tokamak_network" target="_blank" rel="noopener noreferrer">
            <img
              src={XLogo.src}
              alt="Twitter Logo"
              className="h-3 w-3 sm:h-4 sm:w-4 lg:h-4 lg:w-4 inline"
            />
          </a>
          <a href="https://github.com/tokamak-network" target="_blank" rel="noopener noreferrer">
            <img
              src={githubLogo.src}
              alt="GitHub Logo"
              className="h-4 w-4 sm:h-5 sm:w-5 lg:h-5 lg:w-5 inline"
            />
          </a>
          <a href="https://medium.com/tokamak-network" target="_blank" rel="noopener noreferrer">
            <img
              src={mediumLogo.src}
              alt="Medium Logo"
              className="h-3 w-5 sm:h-4 sm:w-6 lg:h-4 lg:w-7 inline"
            />
          </a>
          <a href="https://t.me/tokamak_network" target="_blank" rel="noopener noreferrer">
            <img
              src={tgLogo.src}
              alt="Telegram Logo"
              className="h-4 w-4 sm:h-5 sm:w-5 lg:h-5 lg:w-5 inline"
            />
          </a>
          <a href="https://discord.com/invite/6wJ8HAA2nD" target="_blank" rel="noopener noreferrer">
            <img
              src={discordLogo.src}
              alt="Discord Logo"
              className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 inline"
            />
          </a>
          <a
            href="https://www.linkedin.com/company/tokamaknetwork/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={LinkedinLogo.src}
              alt="LinkedIn Logo"
              className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 inline"
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
