import React, { useState } from 'react'
import Button from '../../Common/Button';
import "./styles.css"
import iphone from "../../../assets/iphone.png.png"
import gradient from "../../../assets/gradient.png.png"
import { motion } from "framer-motion"
import { useNavigate } from 'react-router-dom';

function MainComponent() {
  const navigate = useNavigate();
  const [shareMessage, setShareMessage] = useState('');

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'CryptoTracker',
          text: 'Track crypto in real time with CryptoTracker.',
          url,
        });
        setShareMessage('');
      } catch (error) {
        if (error.name !== 'AbortError') {
          setShareMessage('Unable to share right now. You can copy the page link from your browser.');
        }
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setShareMessage('Link copied to clipboard.');
    } catch (error) {
      setShareMessage('You can share this page using its address: ' + url);
    }
  };

  return (
    <div className="flex-info">
        <div className="left-component">
            <motion.h1
            className="track-crypto-heading" 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            >
                Track crypto
            </motion.h1>
            <motion.h1 className="real-time-heading"  
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.5 }}
            >
                Real Time.
            </motion.h1>
            <motion.p className="info-text" 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 1 }}
            >
                Track crypto through a public api in real time. Visit the dashboard to do so!
            </motion.p>
        <motion.div className="btn-flex" 
            initial={{ opacity: 0, x: 50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.5, delay: 1.5 }}
        >
            <Button text={"Dashboard"} onClick={() => navigate('/dashboard')} />
            <Button text={"Share"} outlined={true} onClick={handleShare} />
            </motion.div> 
            {shareMessage && <p className="share-message" aria-live="polite">{shareMessage}</p>}
        </div>
        <div className="phone-container">
        <motion.img 
        src={iphone} 
        className="iphone"
        initial={{ y: -10 }}
        animate= { { y: 10 }}
        transition={{
            type: "smooth",
            repeatType: "mirror",
            duration: 2,
            repeat: Infinity,
        }}
         alt=''/>
        <img src={gradient} className="gradient" alt='' />
        </div>
    </div>
  )
}

export default MainComponent
 
