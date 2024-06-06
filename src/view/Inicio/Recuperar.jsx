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
import {
  enviarEmail,
  validarCodigo,
  updatePassword,
} from "../../api/Recuperar/Recuperar";
import "../../assets/css/spinner.css";

const Login = () => {
  const [downloading, setDownloading] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState([]);
  const [emailVerificado, setEmailVerificado] = useState(false);
  const [errorVerificacion, setErrorVerificacion] = useState(false);
  const [codigoEmailValidado, setCodigoEmailValidado] = useState(false);
  const [errorCrearCuenta, setErrorCrearCuenta] = useState(false);
  const [cuentaCreada, setcuentaCreada] = useState(false);
  const [errorCambioPassowrd, setErrorCambioPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [intentos, setIntentos] = useState(0);

  const handelSubmit = (e) => {
    e.preventDefault();
    setDownloading(true);
    setErrorVerificacion(false);
    const formData = new FormData(e.target);
    const email = formData.get("email");

    enviarEmail(email)
      .then((res) => res.json())
      .then((data) => {
        setEmail(email);
        setEmailVerificado(true);
        setDownloading(false);
        setLoading(false);

        
      })
      .catch((error) => {
        setErrorVerificacion(true);
        setDownloading(false);
        console.log(error);
      });
    // if (email !== "") {
    //   const usuario = {
    //     correoInstitucional: formData.get("email").toUpperCase(),
    //   };

    //   verificarEmail(usuario)
    //     .then((response) => response.json())
    //     .then((data) => {
    //       if (data === true) {
    //         localStorage.setItem("registro", JSON.stringify(usuario));
    //         setEmailVerificado(true); // Actualiza el estado para indicar que el email ha sido verificado
    //         setErrorVerificacion(false);
    //         enviarEmail(usuario);
    //       } else {
    //         setErrorVerificacion(true);
    //       }
    //     })
    //     .catch((err) => {
    //       setErrorVerificacion(true);
    //     });
    // }
  };

  const handelSubmitCodigoEmail = (event) => {
    event.preventDefault();
    setDownloading(true);
    const formData = new FormData(event.target);

    const codigoVerificacion = formData.get("codigoEmail");

    const codigoPassword = {
      codigo: codigoVerificacion,
    };
    
    let numeroIntentos = intentos;
    setIntentos(numeroIntentos + 1);

    validarCodigo(email, codigoPassword)
      .then((res) => res.json())
      .then((data) => {
        if (data.estado === true) {
          setCodigo(data);
          setDownloading(false);
          setCodigoEmailValidado(true);
        } else {
          setDownloading(false);
          setErrorVerificacion(true);
        }
      })
      .catch((err) => {
        setDownloading(false);
        setErrorVerificacion(true);
        console.log(err);
      });
  };

  const handelSubmitContraseñas = (event) => {
    event.preventDefault();
    setDownloading(true)
    setErrorCambioPassword(false);
    const formData = new FormData(event.target);

    const contraseña = formData.get("password");
    const repetirContraseña = formData.get("repeatPassword");

    // Aquí puedes realizar la validación de las contraseñas, por ejemplo, comparar que sean iguales
    if (contraseña === repetirContraseña) {
      const usuario = {
        email,
        password: contraseña,
      };
     
      updatePassword(codigo.id, usuario)
        .then((response) => response.json())
        .then((data) => {
          console.log(data)
          setDownloading(true)
          if (data === true) {
            setErrorCambioPassword(false);
            setcuentaCreada(true);
            setTimeout(() => {
              navigate("/auth/login?modulo=cliente");
            }, 3500);
          } else {
            setErrorCrearCuenta(true);
          }
        })
        .catch(error=>{
          console.log(error)
          setDownloading(false)
        })
        
    } else {
      setDownloading(false)
      setErrorCambioPassword(true);
    }
  };

  return (
    <>
      <Col lg="5" md="7">
        {downloading && (
          <div className="overlay">
            <div className="spinner " aria-hidden="true"></div>
          </div>
        )}
        <Card
          className="bg-gradient-white shadow border my-2"
          color="dark"
          outline
        >
          <CardBody className="px-lg-5 py-lg-5">
            <h1 className="text-center p-3 text-dark text-uppercase">
              Recuperar{" "}
            </h1>
            {!emailVerificado && (
              <Form role="form" onSubmit={handelSubmit}>
                <p className="text-center ">
                  Ingresa tu correo electronico para recuperar tu contraseña.{" "}
                </p>
                {errorVerificacion && ( // Muestra el mensaje de error solo si hay un error de verificación
                  <div
                    className="alert bg-danger text-white text-center"
                    role="alert"
                  >
                    Verifique la información
                  </div>
                )}
                <FormGroup className="mb-3">
                  <label
                    className="form-control-label text-dark"
                    htmlFor="nombre"
                  >
                    CORREO ELECTRONICO
                  </label>
                  <InputGroup className="input-group-alternative">
                    <InputGroupText>
                      <i
                        className="fa fa-envelope text-primary"
                        aria-hidden="true"
                      />
                    </InputGroupText>
                    <Input
                      className="border text-dark"
                      placeholder="Email"
                      type="email"
                      autoComplete="new-email"
                      name="email"
                      required
                    />
                  </InputGroup>
                </FormGroup>

                <div className="text-center">
                  <Button className="my-4 text-white bg-primary" type="submit">
                    Siguiente
                  </Button>
                </div>
              </Form>
            )}

            {emailVerificado && !codigoEmailValidado && (
              <Form role="form" onSubmit={handelSubmitCodigoEmail}>
                <p className="text-center ">
                  Ingresa el código enviado a tu correo electronico. Tienes 3
                  intentos.
                </p>
                {errorVerificacion && ( // Muestra el mensaje de error solo si hay un error de verificación
                  <div
                    className="alert bg-danger text-white text-center"
                    role="alert"
                  >
                    Código incorrecto intento #{intentos}.
                  </div>
                )}
                {loading ? (
                  <p className="text-center text-warning ">Enviando...</p>
                ) : (
                  <p className="text-center text-success">Código enviado</p>
                )}
                <FormGroup className="mb-3">
                  <InputGroup className="input-group-alternative">
                    <InputGroupText>
                      <i className="fa fa-envelope text-primary" aria-hidden="true" />
                    </InputGroupText>
                    <Input
                    className="text-dark"
                      placeholder="XXX-XXX"
                      type="number"
                      autoComplete="Codigo email"
                      name="codigoEmail"
                      min={0}
                      max={999999}
                      required
                    />
                  </InputGroup>
                </FormGroup>

                <div className="text-center">
                  {intentos < 3 ? (
                    <Button className="my-4" color="primary" type="submit">
                      Validar Codigo
                    </Button>
                  ) : (
                    <p className="text-red h3">no se pudo validar su identidad </p>
                  )}
                </div>
              </Form>
            )}

            {emailVerificado && codigoEmailValidado && (
              <Form role="form" onSubmit={handelSubmitContraseñas}>
                <p className="text-center ">Escribe tu contraseña.</p>
                {cuentaCreada ? ( // Muestra el mensaje de error solo si hay un error de verificación
                  <div
                    className="alert bg-success text-white text-center"
                    role="alert"
                  >
                    <h1 className="text-center">COMPLETADO</h1>
                    <h3 className="text-center">Cambiaste tu contraseña exitosamente.</h3>
                  </div>
                ) : (
                  <>
                    {errorCambioPassowrd && ( // Muestra el mensaje de error solo si hay un error de verificación
                      <div
                        className="alert bg-danger text-white text-center"
                        role="alert"
                      >
                        Las contraseñas no son iguales.
                      </div>
                    )}

                    {errorCrearCuenta && ( // Muestra el mensaje de error solo si hay un error de verificación
                      <div
                        className="alert bg-danger text-white text-center"
                        role="alert"
                      >
                        Ocurrió un error inesperado. Por favor, inténtalo de
                        nuevo más tarde.
                      </div>
                    )}

                    <FormGroup>
                      <InputGroup className="input-group-alternative">
                        <InputGroupText>
                          <i className="fa fa-lock text-primary" aria-hidden="true" />
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
                    <FormGroup>
                      <InputGroup className="input-group-alternative">
                        <InputGroupText>
                          <i className="fa fa-lock text-primary" aria-hidden="true" />
                        </InputGroupText>
                        <Input
                        className="text-dark"
                          placeholder="Repetir Contraseña"
                          type="password"
                          autoComplete="new-password"
                          name="repeatPassword"
                          required
                        />
                      </InputGroup>
                    </FormGroup>

                    <div className="text-center">
                      <Button className="my-4" color="primary" type="submit">
                        Cambiar contraseña
                      </Button>
                    </div>
                  </>
                )}
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
