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
    <footer className="fixed bottom-0 left-0 right-0 p-4 flex justify-between items-center ml-5 mr-10">
      <div className="text-left flex items-center space-x-2">
        <img src={emailLogo.src} alt="Email Logo" className="h-7 w- 7inline" />
        <a href="mailto:hello@tokamak.network" className="text-grey-600 hover:text-blue-800">
          hello@tokamak.network
        </a>
      </div>
      <div className="text-center">
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
      <div className="flex space-x-5">
        <a href="https://x.com/tokamak_network" target="_blank" rel="noopener noreferrer">
          <img src={XLogo.src} alt="Twitter Logo" className="h-4 w-4 inline" />
        </a>
        <a href="https://github.com/tokamak-network" target="_blank" rel="noopener noreferrer">
          <img src={githubLogo.src} alt="GitHub Logo" className="h-5 w-5 inline" />
        </a>
        <a href="https://medium.com/tokamak-network" target="_blank" rel="noopener noreferrer">
          <img src={mediumLogo.src} alt="Medium Logo" className="h-4 w-7 inline" />
        </a>
        <a href="https://t.me/tokamak_network" target="_blank" rel="noopener noreferrer">
          <img src={tgLogo.src} alt="Telegram Logo" className="h-6 w-6 inline" />
        </a>
        <a href="https://discord.com/invite/6wJ8HAA2nD" target="_blank" rel="noopener noreferrer">
          <img src={discordLogo.src} alt="Discord Logo" className="h-7 w-7 inline" />
        </a>
        <a
          href="https://www.linkedin.com/company/tokamaknetwork/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={LinkedinLogo.src} alt="LinkedIn Logo" className="h-6 w-6 inline" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
