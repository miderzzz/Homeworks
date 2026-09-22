export function UserQueue ({ users }) {
    const colors = ["colorUser1", "colorUser2+"]

    return (
        <div className="queue-container">

            {users.map((user, index) => (
                <div key={user.id} className={index === 0 ? "user-current-turn" : "user-card"}>
                <p className="user"> {user.userName}</p> 
            </div>))}

        </div>
    )
}