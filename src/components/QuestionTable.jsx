import { Table } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../App.css'

function preprocess(arr)
{
    let inc = "";
    for (let i = 0; i <= arr.length - 1; i++)
    {
        if (i !== arr.length - 1)
        inc += " " + arr[i] + ", ";

        else
        inc += arr[i]
    }
    return inc
}
export default function QuestionTable ({data})
{
    if (data !== undefined || data !== null)
    return (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Type</th>
              <th>Difficulty</th>
              <th>Category</th>
              <th>Question</th>
              <th>Correct Answer</th>
              <th>Incorrect Answers</th>
            </tr>
          </thead>

          <tbody>
              {data.map((q, i) => { 
              return (
                <tr key={i}>
                  <td>{q.type}</td>
                  <td>{q.difficulty}</td>
                  <td>{q.category}</td>
                  <td>{q.question}</td>
                  <td>{q.correct_answer}</td>
                  <td>{preprocess(q.incorrect_answers)}</td>
                </tr>
                );
              })} 
          </tbody>
        </Table>
    )   
}