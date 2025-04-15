import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fireStore } from "../../config/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import "../../assets/css/notes.css";

const subjects = [
  "Urdu", "English", "Math", "Islamiyat", "Biology",
  "Physics", "Chemistry", "Computer", "Tarjma tul Quran", "Pak Studies"
];

const contentTypes = [
  { label: "📖 Book Lessons", value: "book-lessons" },
  { label: "📝 MCQs", value: "mcqs" },
  { label: "📜 Past Papers", value: "past-papers" },
  { label: "📜 Kamiyab Series", value: "Kamiyab-Series" }
];

const Notes = () => {
  const { selectedClass, subject, contentType } = useParams();
  const navigate = useNavigate();
  const [topics, setTopics] = useState({});
  const [loading, setLoading] = useState(false);
  const [openSubjectId, setOpenSubjectId] = useState(null);
  const [activeContentType, setActiveContentType] = useState(contentType);

  // Sync state with URL
  useEffect(() => {
    if (subject) {
      const subjectId = subjects.findIndex(s => s.toLowerCase() === subject.toLowerCase());
      setOpenSubjectId(subjectId >= 0 ? subjectId : null);
    }
    if (contentType && subject) {
      setActiveContentType(contentType);
      fetchTopics(subject, contentType);
    }
  }, [subject, contentType, selectedClass]);

  const fetchTopics = async (subject, contentType) => {
    setLoading(true);
    try {
      console.log("Fetching topics for subject:", subject, "and contentType:", contentType);
      const q = query(
        collection(fireStore, "topics"),
        where("class", "==", selectedClass),
        where("subject", "==", subject),
        where("contentType", "==", contentType)
      );

      console.log("Fetching topics with query:", q);
      const snapshot = await getDocs(q);
      const topicData = {};
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.topic) topicData[data.topic] = data.fileUrls || [];
      });
      console.log("Fetched topics:", topicData);
      setTopics(topicData);
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
    setLoading(false);
  };


  const handleSubjectClick = (subjectName, index) => {

    console.log('Current openSubjectId:', openSubjectId, 'Clicked index:', index);
  const newOpenId = openSubjectId === index ? null : index;
  console.log('Setting new openSubjectId:', newOpenId);
  
    setOpenSubjectId(newOpenId);
    
    if (newOpenId !== null) {
      navigate(`/notes/${selectedClass}/${subjectName.toLowerCase()}`);
    } else {
      navigate(`/notes/${selectedClass}`);
    }
    
    if (openSubjectId !== index) {
      setActiveContentType(null);
      setTopics({});
    }
  };

  const handleContentTypeClick = (subjectName, type) => {
    setActiveContentType(type);
    navigate(`/notes/${selectedClass}/${subjectName.toLowerCase()}/${type}`);
    fetchTopics(subjectName, type);
  };

  const handleTopicClick = (topicName) => {
    const fileUrl = topics[topicName]?.[0];
    if (fileUrl) navigate(`/preview?url=${encodeURIComponent(fileUrl)}`);
  };

  return (
    <div className="notes-container">
      <main>
        <h2>Welcome to Our Educational Portal</h2>
        <p className="intro-text py-3 fw-bold">Our goal is to provide high-quality educational resources.</p>

        <div className="subjects-grid">
          {subjects.map((subjectName, index) => (
            <div 
              key={index}
              className={`subject-card ${openSubjectId === index ? 'active' : ''}`}
              data-testid={`subject-card-${index}`}
            >
              <div 
                className="subject-header"
                onClick={() => handleSubjectClick(subjectName, index)}
              >
                <span>{subjectName}</span>
                <span>{openSubjectId === index ? '▼' : '►'}</span>
              </div>

              <div className={`dropdown-container ${openSubjectId === index ? 'visible' : ''}`}>
                <div className="dropdown-content">
                  {contentTypes.map(({ label, value }) => (
                    <div key={value}>
                      <div 
                        className={`content-type ${activeContentType === value ? 'active' : ''}`}
                        onClick={() => handleContentTypeClick(subjectName, value)}
                      >
                        {label}
                      </div>
                      
                      {activeContentType === value && (
                        <div className="topics-list">
                          {loading ? (
                            <div className="loading">Loading...</div>
                          ) : Object.keys(topics).length > 0 ? (
                            Object.keys(topics).map((topicName, i) => (
                              <div 
                                key={i}
                                className="topic-item"
                                onClick={() => handleTopicClick(topicName)}
                              >
                                📌 {topicName}
                              </div>
                            ))
                          ) : (
                            <div className="no-topics">No topics available</div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Notes;