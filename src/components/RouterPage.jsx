import React from 'react'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Switch } from 'react-router-dom/cjs/react-router-dom.min';
import HomePage from './Homepage';
import PostPage from './PostPage';
import { Route, withRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
import PostInsertPage from './post/PostInsertPage';
import PostReadPage from './post/PostReadPage';
import PostUpdatePage from './post/PostUpdatePage';


const RouterPage = ({ history }) => {

    const onLogout = (e) => {
        e.preventDefault();
        sessionStorage.removeItem("uid");
        history.push("/");
    }

    return (
        <>
            <Navbar bg="light" expand="lg">
                <Container fluid>
                    <Navbar.Brand href="/">Logo</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '100%' }}
                            navbarScroll
                        >
                            <Nav.Link href="/">Home</Nav.Link>
                            <Nav.Link href="/post">게시글</Nav.Link>
                        </Nav>

                        <div className='d-flex'>
                            {sessionStorage.getItem("uid") === null ?
                                <Nav.Link href="/login">로그인</Nav.Link> :
                                <>
                                    <Nav.Link href="/logout" onClick={onLogout} className="me-3">로그아웃</Nav.Link>
                                    <Nav.Link href="/mypage">{sessionStorage.getItem('uid')}님</Nav.Link>
                                </>
                            }

                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Switch>
                <Route path="/" component={HomePage} exact="true" />
                <Route path="/post" component={PostPage} exact="true" />
                <Route path="/login" component={LoginPage} />
                <Route path="/post/insert" component={PostInsertPage} />
                <Route path="/post/read/:id" component={PostReadPage} />
                <Route path="/post/update/:id" component={PostUpdatePage} />
            </Switch>
        </>
    )
}

export default withRouter(RouterPage)