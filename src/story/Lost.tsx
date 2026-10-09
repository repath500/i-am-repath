import { navigate } from '../router'
import './story.css'

function Lost() {
  return (
    <main className="lost">
      <div>
        <p>404</p>
        <h1>this page got eaten.</h1>
        <p>sorry. spice bag said it was very good.</p>
        <p>
          <a
            href="/"
            onClick={(event) => {
              event.preventDefault()
              navigate('/')
            }}
          >
            back to the story
          </a>
        </p>
      </div>
    </main>
  )
}

export default Lost
