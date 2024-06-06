import { Card, CardBody } from "reactstrap";



const SpinnerGrupo = () => {
    
  return (
    <>
      <Card className="my-2 text-center">
        <CardBody>
          <>
            <div class="spinner-grow text-primary" role="status">
              <span class="visually-hidden">C</span>
            </div>

            <div class="spinner-grow text-success" role="status">
              <span class="visually-hidden">A</span>
            </div>
            <div class="spinner-grow text-danger" role="status">
              <span class="visually-hidden">R</span>
            </div>
            <div class="spinner-grow text-warning" role="status">
              <span class="visually-hidden">G</span>
            </div>
            <div class="spinner-grow text-info" role="status">
              <span class="visually-hidden">A</span>
            </div>
          </>
        </CardBody>
      </Card>
    </>
  );
};

export default SpinnerGrupo;
