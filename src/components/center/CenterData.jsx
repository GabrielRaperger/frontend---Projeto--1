import React from "react";
import axios from "axios";
import Content from "../template/Content";
import { useParams } from "react-router";
import CenterRoom from "./CenterRoom";
import CenterUser from "./CenterUser";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { baseApiUrl, showError, showSuccess } from "../../config/global";
import Accordion from "react-bootstrap/Accordion";
import AccordionHeader from "../template/AccordionHeader";
import Badge from "react-bootstrap/Badge";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const initState = {
  center: {},
  statusIcon: "",
  statusColor: "",
  statusAction: "",
};

class CenterData extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...initState };
  }
  componentDidMount() {
    const id = this.props.params.id;
    this.loadCenter(id);
  }
  async loadCenter(id) {
    const url = `${baseApiUrl}/center/${id}`;
    await axios
      .get(url)
      .then(async (res) => {
        this.setState({ center: res.data });
        res.data.status.code === 100 ? this.activate() : this.inactivate();
        console.log(res.data);
      })
      .catch(showError);
  }
  updateCenter() {
    if (this.state.center.status) {
      const code = this.state.center.status.code === 100 ? 103 : 100;
      axios
        .put(
          `${baseApiUrl}/center/${this.props.params.id}/status?status=${code}`
        )
        .then(() => {
          showSuccess("Operação realizada com sucesso");
          this.loadCenter(this.props.params.id);
        })
        .catch(showError);
    }
  }
  inactivate() {
    this.setState({ statusIcon: "fa fa-toggle-off" });
    this.setState({ statusColor: "text-secondary" });
    this.setState({ statusAction: "Ativar" });
  }
  activate() {
    this.setState({ statusIcon: "fa fa-toggle-on" });
    this.setState({ statusColor: "text-success" });
    this.setState({ statusAction: "Inativar" });
  }
  deleteCenter() {
    const a = this.props.params.id;

    var config = {
      method: "delete",
      url: `${baseApiUrl}/center/${a}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then(() => {
        showSuccess("Centro excluído com sucesso");
        this.props.navigate(`/center-table`);
      })
      .catch(showError);
  }
  convertSecondsToHours(value) {
    const sec = parseInt(value, 10);
    let hours = Math.floor(sec / 3600);
    let minutes = Math.floor((sec - hours * 3600) / 60);
    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    return hours + ":" + minutes;
  }
  renderAccordion() {
    return (
      <Accordion>
        <Accordion.Item>
          <Accordion.Header>
            <AccordionHeader icon="fa fa-university" title={this.state.center.name} />
          </Accordion.Header>
          <Accordion.Body>
            <div className="row">
              <div className="col-md-10">
                <h6>Localização</h6>
                <p>
                  {this.state.center.address}, {this.state.center.postal_code},{" "}
                  {this.state.center.region}
                </p>
              </div>
              <div className="col-md-2">
                <h6>Ações</h6>
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>Editar</Tooltip>}
                >
                  <Link
                    className="btn btn-link"
                    to={`/center-form/${this.props.params.id}`}
                  >
                    <i className="fa fa-pencil text-primary"></i>
                  </Link>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>{this.state.statusAction}</Tooltip>}
                >
                  <button
                    className="btn btn-link"
                    onClick={() => this.updateCenter()}
                  >
                    <i
                      className={`${this.state.statusIcon} ${this.state.statusColor}`}
                    ></i>
                  </button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>Excluir</Tooltip>}
                >
                  <button
                    className="btn btn-link"
                    onClick={() => this.deleteCenter()}
                  >
                    <i className="fa fa-trash text-danger"></i>
                  </button>
                </OverlayTrigger>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-4">
                <div>
                  <h6>Estado</h6>
                  {this.state.center.status ? (
                    this.state.center.status.code === 100 ? (
                      <Badge pill bg="success">
                        Ativo
                      </Badge>
                    ) : (
                      <Badge pill bg="secondary">
                        Inativo
                      </Badge>
                    )
                  ) : (
                    ""
                  )}
                </div>
                <div className="mt-2">
                  <h6>Horário</h6>
                  {this.convertSecondsToHours(this.state.center.opening)} -{" "}
                  {this.convertSecondsToHours(this.state.center.closure)}
                </div>
              </div>
              <div className="col-md-8">
                <div className="row">
                  <h6>Contactos</h6>
                  <div className="col-md-6">
                    <div className="input-group flex-nowrap">
                      <span className="input-group-text">
                        <i className="fa fa-phone"></i>
                      </span>
                      <input
                        disabled
                        type="text"
                        className="form-control"
                        value={this.state.center.phone_primary}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-group flex-nowrap">
                      <span className="input-group-text">
                        <i className="fa fa-phone"></i>
                      </span>
                      <input
                        disabled
                        type="text"
                        className="form-control"
                        value={this.state.center.phone_secondary}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="input-group flex-nowrap mt-1">
                      <span className="input-group-text">@</span>
                      <input
                        disabled
                        type="text"
                        className="form-control"
                        value={this.state.center.email}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-group flex-nowrap mt-1">
                      <span className="input-group-text">
                        <i className="fa fa-globe"></i>
                      </span>
                      <input
                        disabled
                        type="text"
                        className="form-control"
                        value={this.state.center.website_url}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-6">
                <h6>Número de Salas</h6>
                <h3>{this.state.center.total_rooms}</h3>
              </div>
              <div className="col-md-6">
                <h6>Número de Utilizadores</h6>
                <h3>{this.state.center.total_accounts}</h3>
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  }
  renderTabs() {
    return (
      <Tabs defaultActiveKey="room" className="mb-3 mt-3">
        <Tab eventKey="room" title="Salas">
          <CenterRoom id={`${this.props.params.id}`} />
        </Tab>
        <Tab eventKey="user" title="Utilizadores">
          <CenterUser id={`${this.props.params.id}`} />
        </Tab>
      </Tabs>
    );
  }
  render() {
    return (
      <Content>
        {this.renderAccordion()}
        {this.renderTabs()}
      </Content>
    );
  }
}

export default function Center(props) {
  let params = useParams();
  let navigate = useNavigate();
  return <CenterData {...props} params={params} navigate={navigate} />;
}
