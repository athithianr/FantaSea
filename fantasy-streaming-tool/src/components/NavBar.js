const SignOut = (props) => {
    const auth = props.auth
    return auth.currentUser && (
        <div className="signOutButton">
            <button className="signOutButton" onClick={() => auth.signOut()}>Sign out</button>
        </div>
    )
}

const NavBar = (props) => {
    return (
        <div class="navbar">
            <div class="container flex">
                <h1 >Fanta Sea</h1>
                <SignOut auth={props.auth} />
            </div>
        </div>
    );
}

export default NavBar;