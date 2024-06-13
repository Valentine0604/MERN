const UserDetails = (props) => {
    const user = props.user;
    return (
        <div>
            <h1>Account Details</h1>
            <h2>{user.firstName} {user.lastName}</h2>
            <p>User ID: {user._id}</p>
            <p>Email: {user.email}</p>
        </div>
    );
}

export default UserDetails;
