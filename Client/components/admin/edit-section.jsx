import React from 'react'
import styles from '../../styles/edit-section.module.css'
import axios from 'axios';


const EditSection = ({section, sections, setSections}) => {

    const handleDelete = async (id) => {
        try {
          const res = await axios.delete(
            "http://localhost:3000/api/sections/" + id
          );
          setSections(sections.filter((sect) => sect._id !== id));
        } catch (err) {
          console.log(err);
        }
      };
          return(
                    
                      <tr className={styles.tr_title}>
                          <td>{'12345678809'.slice(0, 5)}...</td>
                          <td>{section.title}</td>
                          <td>
                              <button className={styles.btn_delete} onClick={() => handleDelete(section._id)}>Delete</button>
                          </td>
                      </tr>
                      )
}

export default EditSection