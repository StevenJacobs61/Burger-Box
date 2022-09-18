import React from 'react'
import { useState } from 'react'
import styles from '../../styles/edit-sections.module.css'
import EditSection from './edit-section';
import AddSection from './add-section';
import { useEffect } from 'react';
import axios from 'axios';

const EditSections = ({sections, setSections}) => {
  
    const[showSections, setShowSections] = useState(false)
    const [showAdd, setShowAdd] = useState(false);
    const [open, setOpen] = useState();

    useEffect(() => {
      const sectionClosed = sections.filter((section) => 
        !section.available);
        const isOpen = sectionClosed.length < sections.length;
      if(!isOpen){
        setOpen(false)
      };
      if (isOpen){
        setOpen(true)
      }
    }, [sections]);

    const handleAvailable = async () => {
      const newOpen = !open;
      const filter = { };
      const update = {
        available:newOpen
      };
      try{
        const res = await axios.patch('http://localhost:3000/api/sections', {filter, update});
        setSections(sections.map((sect) => {
        sect.available = update.available;
        return sect;
      }))
      }catch(err){
        console.log(err);
    };
  };


    
  return (
    <div className={styles.container}>
    <div className={styles.title_container}>
      <h1 className={styles.header} onClick={() => setShowSections(!showSections)}>Sections</h1>
      <div className={styles.btn_container}>
<button className={styles.btn_clear} onClick={() => setShowAdd(true)}>Add <br/>Section</button>
<button className={styles.btn_available} 
        style={{color: open ? '#106a00' : '#7c0303'}}
        onClick={() => handleAvailable()}>{open ? "Store Open" : "Store Closed"}</button>
</div>
</div>
         {showSections && <table className={styles.table} >
              <tbody>
                  <tr className={styles.tr_title}>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Action</th>
                  </tr>
              </tbody>
                <tbody>
              {sections.map((section) => <EditSection key={section._id} section={section} setSections={setSections} sections={sections}/>)}
          </tbody>
          </table>}
       
          {showAdd ?  <AddSection setShowAdd={setShowAdd} sections={sections} setSections={setSections}/> : null}
  </div>
  )
}

export default EditSections