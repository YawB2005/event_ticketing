"use client";

import { useState } from 'react';
import styles from './Messages.module.css';
import { Search, Send, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const mockMessages = [
  {
    id: 1,
    sender: "Support Team",
    email: "support@etsp.com",
    subject: "Weekly Analytics Report Available",
    preview: "Your weekly event analytics report is now ready to view in the dashboard...",
    time: "10:30 AM",
    unread: true,
    body: "Hi Rave Culture Ltd,\n\nYour weekly analytics report for August 1st - August 7th is now ready. You've seen a 20% increase in ticket sales across all active events this week.\n\nKeep up the great work!\n\nBest,\nETSP Support Team",
    avatarColor: "#4f46e5"
  },
  {
    id: 2,
    sender: "Alex Johnson",
    email: "alex.j@example.com",
    subject: "Question about Neon Nights VIP",
    preview: "Hi, I purchased a VIP ticket for Neon Nights and was wondering...",
    time: "Yesterday",
    unread: true,
    body: "Hi,\n\nI purchased a VIP ticket for Neon Nights and was wondering if the VIP lounge access includes complimentary drinks or if those need to be purchased separately?\n\nThanks,\nAlex",
    avatarColor: "#ec4899"
  },
  {
    id: 3,
    sender: "Billing Department",
    email: "billing@etsp.com",
    subject: "Payout Successful",
    preview: "Your payout of GH₵ 5,420 has been successfully processed to your bank account.",
    time: "Aug 12",
    unread: false,
    body: "Hello,\n\nThis is a confirmation that your payout of GH₵ 5,420 has been successfully processed and should reflect in your registered bank account within 1-2 business days.\n\nThank you for using ETSP.",
    avatarColor: "#10b981"
  },
  {
    id: 4,
    sender: "Sarah Smith",
    email: "sarah.s@example.com",
    subject: "Accessibility Requirements",
    preview: "Hello, I will be attending the Comedy Cellar event and require wheelchair access.",
    time: "Aug 10",
    unread: false,
    body: "Hello,\n\nI will be attending the Comedy Cellar event next week. Could you please confirm if the venue has wheelchair access and dedicated seating areas?\n\nLooking forward to it,\nSarah",
    avatarColor: "#f59e0b"
  }
];

export default function MessagesPage() {
  const [messages, setMessages] = useState(mockMessages);
  const [selectedMsgId, setSelectedMsgId] = useState(mockMessages[0].id);

  const activeMessage = messages.find(m => m.id === selectedMsgId);

  const handleSelectMessage = (id) => {
    setSelectedMsgId(id);
    // Mark as read
    setMessages(msgs => msgs.map(m => m.id === id ? { ...m, unread: false } : m));
  };

  return (
    <div className={styles.page}>
      
      <div className={styles.header}>
        <h1>Messages</h1>
        <p>Communicate with attendees and ETSP support</p>
      </div>

      <div className={styles.messagesContainer}>
        
        {/* LEFT PANE - MESSAGE LIST */}
        <div className={styles.messageListPane}>
          <div className={styles.searchHeader}>
            <div className={styles.searchBox}>
              <Search size={18} color="#94a3b8" />
              <input type="text" placeholder="Search messages..." />
            </div>
          </div>
          
          <div className={styles.listScroll}>
            {messages.map(msg => (
              <div 
                key={msg.id} 
                className={`${styles.messageSnippet} ${msg.unread ? styles.unread : ''} ${selectedMsgId === msg.id ? styles.active : ''}`}
                onClick={() => handleSelectMessage(msg.id)}
              >
                <div className={styles.snippetHeader}>
                  <span className={styles.senderName}>{msg.sender}</span>
                  <span className={styles.snippetTime}>{msg.time}</span>
                </div>
                <div className={styles.snippetSubject}>{msg.subject}</div>
                <div className={styles.snippetPreview}>{msg.preview}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANE - MESSAGE VIEW */}
        <div className={styles.messageViewPane}>
          {activeMessage ? (
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeMessage.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                <div className={styles.viewHeader}>
                  <h2 className={styles.viewSubject}>{activeMessage.subject}</h2>
                  <div className={styles.senderProfile}>
                    <div className={styles.avatar} style={{ background: activeMessage.avatarColor }}>
                      {activeMessage.sender.charAt(0)}
                    </div>
                    <div className={styles.senderDetails}>
                      <strong>{activeMessage.sender}</strong>
                      <span>{activeMessage.email}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.viewBody}>
                  {activeMessage.body.split('\n').map((para, i) => (
                    <p key={i} style={{ marginBottom: para ? '1rem' : '0' }}>{para}</p>
                  ))}
                </div>

                <div className={styles.viewActions}>
                  <div className={styles.replyBox}>
                    <textarea placeholder={`Reply to ${activeMessage.sender}...`}></textarea>
                    <button className={styles.replyBtn}>
                      <Send size={16} /> Send Reply
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className={styles.emptyState}>
              <Mail size={48} color="#cbd5e1" />
              <p>Select a message to read</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
