// reactstrap components
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroup,
  InputGroupText,
  Row,
  Col,
} from "reactstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {  saveCliente} from "../../api/Registro/Cliente";
import "../../assets/css/spinner.css"
const Login = () => {
  const navigate = useNavigate();
  const [emailVerificado, setEmailVerificado] = useState(false);
  const [errorCambioPassowrd, setErrorCambioPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [downloading, setDownloading] = useState(false);

  const handelSubmit = (e) => {
    e.preventDefault();
    setDownloading(true)
    setErrorCambioPassword(false);
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const nombres = formData.get("nombres");
    const email = formData.get("email");
    const password = formData.get("password");
    const password2 = formData.get("password2");
    if (password === password2) {
      const usuario = {
        usuario:username,
        nombre:nombres,
        email,
        clave: password,
      };
      saveUser(usuario)
      .then(response=>response.json())
      .then(data=>{
        setDownloading(false)
        
        setEmailVerificado(true);
        
      })
      .catch(err=>{
        console.log(err)
    })
      
    } else {
      setDownloading(false)
      setErrorCambioPassword(true);
    }
  };

 

  return (
    <>
      <Col lg="8" md="9">
        <Card
          className="bg-gradient-white shadow border my-2"
          color="dark"
          outline
        >
          <CardBody className="px-lg-5 py-lg-5">
          {downloading && (
          <div className="overlay">
            <div className="spinner " aria-hidden="true"></div>
          </div>
        )}
            <h1 className="text-center p-3 text-dark">Crear cuenta</h1>
            {!emailVerificado && (
              <Form role="form" onSubmit={handelSubmit}>
                <p className="text-center">
                  Completa la siguiente información.
                </p>

                {errorCambioPassowrd && ( // Muestra el mensaje de error solo si hay un error de verificación
                  <div
                    className="alert bg-danger text-white text-center"
                    role="alert"
                  >
                    Las contraseñas no son iguales.
                  </div>
                )}

                <Row>
                  <Col md={4}>
                    <FormGroup className="mb-3">
                      <InputGroup className="input-group-alternative">
                        <InputGroupText>
                          <i className="fa fa-user" aria-hidden="true" />
                        </InputGroupText>
                        <Input
                          className="text-dark"
                          placeholder="Username o Codigo"
                          type="text"
                          autoComplete="new-email"
                          name="username"
                          required
                        />
                      </InputGroup>
                    </FormGroup>
                  </Col>
                  <Col md={8}>
                    <FormGroup>
                      <InputGroup className="input-group-alternative">
                        <InputGroupText>
                          <i className="fa fa-id-card" aria-hidden="true" />
                        </InputGroupText>
                        <Input
                          className="text-dark"
                          placeholder="Nombre y Apellido"
                          type="text"
                          autoComplete="Nombres"
                          name="nombres"
                          required
                        />
                      </InputGroup>
                    </FormGroup>
                  </Col>
                  <Col md={12}>
                    <FormGroup className="mb-3">
                      <InputGroup className="input-group-alternative">
                        <InputGroupText>
                          <i className="fa fa-envelope" aria-hidden="true" />
                        </InputGroupText>
                        <Input
                          className="text-dark"
                          placeholder="Email"
                          type="email"
                          autoComplete="new-email"
                          name="email"
                          required
                        />
                      </InputGroup>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <InputGroup className="input-group-alternative">
                        <InputGroupText>
                          <i className="fa fa-lock" aria-hidden="true" />
                        </InputGroupText>
                        <Input
                          className="text-dark"
                          placeholder="Contraseña"
                          type="password"
                          autoComplete="new-password"
                          name="password"
                          required
                        />
                      </InputGroup>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <InputGroup className="input-group-alternative">
                        <InputGroupText>
                          <i className="fa fa-lock" aria-hidden="true" />
                        </InputGroupText>
                        <Input
                          className="text-dark"
                          placeholder="Repetir Contraseña"
                          type="password"
                          autoComplete="new-password"
                          name="password2"
                          required
                        />
                      </InputGroup>
                    </FormGroup>
                  </Col>
                </Row>

                <div className="text-center">
                  <Button
                    className="my-4 text-white bg-gradient-primary"
                    type="submit"
                  >
                    Registrarme
                  </Button>
                </div>
              </Form>
            )}

            {emailVerificado && (
              <Form role="form">
                <p className="text-center text-success">Email enviado</p>
                <br />
                <p className="text-center ">
                  Estimado usuario se envio un email con un link para activar su
                  cuenta
                </p>
                <p className="text-center ">
                  1- Ingresa al link y se activara su cuenta
                </p>
                <p className="text-center ">
                  2- Vuelve al login e inicia sesion
                </p>
              </Form>
            )}
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col xs="6">
            <Link className="text-dark" to={`/auth/login`}>
              <small className="text-dark h5">Volver a iniciar sesión</small>
            </Link>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default Login;
