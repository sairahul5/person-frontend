import { useState } from 'react'
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    name: '',
    age: ''
  })
  const [message, setMessage] = useState('')
  const [advice, setAdvice] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
    setMessage('')
    setAdvice('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setAdvice('')

    // Validation
    if (!formData.name.trim()) {
      setError('Please enter your name')
      return
    }

    if (!formData.age.trim()) {
      setError('Please enter your age')
      return
    }

    const ageNum = parseInt(formData.age)
    if (isNaN(ageNum) || ageNum < 0) {
      setError('Please enter a valid age (number)')
      return
    }

    setLoading(true)

    try {
      // Save person to database
      const response = await fetch('http://localhost:8080/api/person', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          age: ageNum
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save person')
      }

      const savedPerson = await response.json()
      setMessage(`Success! ${savedPerson.name} (Age: ${savedPerson.age}) has been saved!`)

      // Fetch advice based on age
      const adviceResponse = await fetch(`http://localhost:8080/api/person/advice/${ageNum}`)
      if (adviceResponse.ok) {
        const adviceData = await adviceResponse.json()
        setAdvice(adviceData.advice)
      }

      // Clear form
      setFormData({ name: '', age: '' })

    } catch (err) {
      setError('Failed to connect to server. Make sure backend is running on port 8080')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-container">
      <div className="form-card">
        <h1>Person Registration</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="age">Age:</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter your age"
              min="0"
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Saving...' : 'Submit'}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}
        
        {message && <div className="success-message">{message}</div>}
        
        {advice && (
          <div className="advice-card">
            <h3>💡 Advice for your age:</h3>
            <p>{advice}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

