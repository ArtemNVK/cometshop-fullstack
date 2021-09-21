import React from 'react';
import MessageBox from '../components/MessageBox';
import { Link } from 'react-router-dom';


export default function PageNotFound() {


  return (
    <div style={{"margin-top": "5rem"}}>
        <MessageBox>
            Page not Found. <Link to="/"><span className="call-to-action">Go shopping</span></Link>
        </MessageBox>
    </div>
  );
}
