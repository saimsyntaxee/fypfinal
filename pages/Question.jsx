
import { useState, useEffect } from 'react'
import { Button } from "../src/components/ui/button"
import { Input } from "../src/components/ui/input"
import { Label } from "../src/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "../src/components/ui/alert"

export default function Questions({ restaurantId }) {
  const [questions, setQuestions] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [newQuestion, setNewQuestion] = useState('')
  const [userUploadedQuestions, setUserUploadedQuestions] = useState([])

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/restromap/restaurant/${restaurantId}/question/`)
      if (response.ok) {
        const data = await response.json()
        setQuestions(data)
      } else {
        console.error('Failed to fetch questions')
      }
    } catch (error) {
      console.error('Error fetching questions:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`http://127.0.0.1:8000/restromap/restaurant/${restaurantId}/question/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body:  JSON.stringify({ question: newQuestion }),
      })
      if (response.ok) {
        const data = await response.json()
        setUserUploadedQuestions([...userUploadedQuestions, data.id])
        fetchQuestions()
        setShowForm(false)
        setNewQuestion('')
      } else {
        console.error('Failed to post question')
      }
    } catch (error) {
      console.error('Error posting question:', error)
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/restromap/restaurant/${restaurantId}/question/${id}/answer/`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setUserUploadedQuestions(userUploadedQuestions.filter(qId => qId !== id))
        fetchQuestions()
      } else {
        console.error('Failed to delete question')
      }
    } catch (error) {
      console.error('Error deleting question:', error)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Questions</h2>
      {questions.length === 0 ? (
        <Alert>
          <AlertTitle>No questions</AlertTitle>
          <AlertDescription>There are no questions for this restaurant yet.</AlertDescription>
        </Alert>
      ) : (
        <ul className="space-y-2">
          {questions.map((q) => (
            <li key={q.id} className="p-2 border rounded">
              <p>User: {q.user.first_name} {q.user.last_name}</p>
              <p>Question: {q.question}</p>
              <p>Date: {new Date(q.date_created).toLocaleDateString()}</p>
              {q.answer && <p>Answer: {q.answer}</p>}
              {userUploadedQuestions.includes(q.id) && (
                <Button onClick={() => handleDelete(q.id)} variant="destructive">Delete</Button>
              )}
            </li>
          ))}
        </ul>
      )}
      {!showForm ? (
        <Button onClick={() => setShowForm(true)}>Post a Question</Button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="question">Your Question</Label>
            <Input
              id="question"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              required
            />
          </div>
          <Button type="submit">Submit Question</Button>
        </form>
      )}
    </div>
  )
}