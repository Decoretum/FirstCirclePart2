import { useState, useEffect } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
import './App.css'
import QuestionTable from './components/QuestionTable';
import 'bootstrap/dist/css/bootstrap.min.css'


async function fetchData(n)
{
  try {
    let url = `https://opentdb.com/api.php?amount=${n}`;
    return new Promise ((res, rej) => {
      setTimeout(() => {
         axios.get(url)
        .then((promise) => res(promise))
        .catch((err) => {console.log("API Rate Limiter error!"); rej(err);});
      }, 5000)
    })
  
  } catch (err) {
    console.log(err);
  }
}

function downloadJSON(data)
{
  let fileName = 'data.json';
  const jsonString = JSON.stringify(data, null, 2);

  //https://developer.mozilla.org/en-US/docs/Web/API/Blob
  // The File itself
  let blob = new Blob([jsonString], {type: 'application/json'});
  let url = URL.createObjectURL(blob);
  
  let link = document.createElement('a');
  link.href = url;
  link.download = fileName;

  //setting the link to the document's body
  document.body.appendChild(link);
  link.click();
}

async function downloadCSV(data)
{
  let fileName = 'data.csv';
  const rows = [];
  const arr = data;
  const cols = Object.keys(arr[0])

  //Push headers into arr
  rows.push(cols.join(','));

  //Push data into arr
  for (let i = 0; i <= data.length - 1; i++)
  {
    const row = data[i];
    let rowValues = cols.map((header) => {
      if (header === 'incorrect_answers')
      {
        let val = row[header];
        return val.join(',');
      }
      let val = row[header];
      return `${val}`;
    })
    rows.push(rowValues.join(','));
  }

  //Lines are divided by newline now
  let csv = rows.join('\n');

  let blob = new Blob([csv], {type: 'text/csv'});
  let url = URL.createObjectURL(blob);
  
  let link = document.createElement('a');
  link.href = url;
  link.download = fileName;

  //setting the link to the document's body
  document.body.appendChild(link);
  link.click();
}




function App() {
  const [data, setData] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const columns = ['Type', 'Difficulty', 'Category', 'Question',
  'Correct Answer', 'Incorrect Answers'];
  useEffect(() => {
    const delayData = async () => {
      for (let i = 0; i < 3; i++)
      {
        const getData = await fetchData(5);
        if (getData !== undefined)
        {
          setError(false);
          setData((prevArray) => [...prevArray, ...getData.data.results]);
        } else {
          setError(true);
        }
      }
      setSuccess(true);
      console.log("Fetching data finished!");  
    } 
    delayData();
  }, [])
  
  
  if (success === false && error === false)
  return (
    <div> Currently Fetching Data. {data.length} out of 15 questions fetched </div>
    )

    
  if (success === false && error === true)
  return (
    <>
      <div>
        Currently Fetching Data. {data.length} out of 15 questions fetched
      </div>

      <div>
        API Rate Limiter reached! This will take a while.
      </div>
    </>
    )
  
  //Show tables
 if (success === true && error === false && (data !== undefined || data !== null))
  return (
    <>
      <Container style={{marginBottom: '5vh'}}> 
        <Row>
          <Col>Choose Your Option</Col>
          <Col><Button variant='success' onClick={() => {downloadCSV(data)}}>CSV</Button></Col>
          <Col><Button variant='success' onClick={() => {console.log(data)}}>Print to Console</Button></Col>
          <Col><Button variant='success' onClick={() => {downloadJSON(data)}}>JSON</Button></Col>
        </Row>      
      </Container>

      <QuestionTable data={data} />

      
    </>
    )
  
  
  

  
}

export default App;
