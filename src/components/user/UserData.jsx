import React from "react";
import axios from "axios";
import Content from "../template/Content";
import { useParams } from "react-router";
import {
  baseApiUrl,
  showError,
  showSuccess,
  userKey,
} from "../../config/global";
import Accordion from "react-bootstrap/Accordion";
import AccordionHeader from "../template/AccordionHeader";
import Badge from "react-bootstrap/Badge";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import If from "../template/If";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import UserStatistics from "./UserStatistics";
import UserReserves from "./UserReserves";
import UserCleanings from "./UserCleanings";

const initState = {
  user: {},
  statusIcon: "",
  statusColor: "",
  statusAction: "",
  displayActions: true,
};

class UserData extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...initState };
  }
  componentDidMount() {
    const id = this.props.params.id;
    this.loadUsers(id);
    this.compareAccount();
  }
  async loadUsers(id) {
    const url = `${baseApiUrl}/account/${id}`;
    await axios
      .get(url)
      .then(async (res) => {
        this.setState({ user: res.data });
        res.data.status.code === 100 ? this.activate() : this.inactivate();
      })
      .catch(showError);
  }
  compareAccount() {
    const id = this.props.params.id;
    const json = localStorage.getItem(userKey);
    const userData = JSON.parse(json);
    if (!userData) this.props.navigate(`/auth/signin`);
    else {
      if (userData.id == id) this.setState({ displayActions: false });
      else this.setState({ displayActions: true });
    }
  }
  updateCenter() {
    const id = this.props.params.id;
    if (this.state.user.status) {
      const code = this.state.user.status.code === 100 ? 101 : 100;
      axios
        .put(`${baseApiUrl}/account/${id}/status?status=${code}`)
        .then(() => {
          showSuccess("Operação realizada com sucesso");
          this.loadUsers(this.props.params.id);
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
      url: `${baseApiUrl}/account/${a}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then(() => {
        showSuccess("Utilizador excluído com sucesso");
        this.props.navigate(`/user-table`);
      })
      .catch(function (error) {
        showError(error);
        console.log(error);
      });
  }
  mapCenters() {
    const user = { ...this.state.user };
    if (user.centers) {
      return user.centers.map((center) => {
        return (
          <div className="col-md-3">
            <div className="input-group flex-nowrap">
              <span className="input-group-text">
                <i className="fa fa-institution"></i>
              </span>
              <input
                disabled
                type="text"
                className="form-control"
                value={center.name}
              />
            </div>
          </div>
        );
      });
    }
  }
  renderAccordion() {
    return (
      <Accordion>
        <Accordion.Item>
          <Accordion.Header>
            <AccordionHeader icon="fa fa-user" title={this.state.user.name} />
          </Accordion.Header>
          <Accordion.Body>
            <div className="row">
              <div className="col-md-4">
                <h6>Email</h6>
                <p>{this.state.user.email}</p>
              </div>
              <div className="col-md-3">
                <h6>Perfil</h6>
                <p>
                  {this.state.user.profile == "admin"
                    ? "Administrador"
                    : this.state.user.profile == "staff"
                    ? "Equipa De Limpeza"
                    : "Utilizador"}
                </p>
              </div>
              <div className="col-md-3">
                <h6>Telefone</h6>
                <p>{this.state.user.phone}</p>
              </div>
              <div className="col-md-2">
                <If test={this.state.displayActions}>
                  <h6>Ações</h6>
                  <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip>Editar</Tooltip>}
                  >
                    <Link
                      className="btn btn-link"
                      to={`/user-form/${this.props.params.id}`}
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
                </If>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-4">
                <h6>Estado</h6>
                {this.state.user.status ? (
                  this.state.user.status.code === 100 ? (
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
              <div className="col-md-3">
                <h6>Último login</h6>
                <p>{this.state.user.last_login}</p>
              </div>
              <div className="col-md-3">
                <h6>Data de Registo</h6>
                <p>{this.state.user.created_at}</p>
              </div>
            </div>
            <If test={this.state.user.profile !== "admin"}>
              <div className="row mt-2">
                <h6>Centros Geográficos</h6>
                {this.mapCenters()}
              </div>
            </If>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  }
  renderTabs() {
    const { user } = this.state;
    return (
      <If test={user.profile}>
        <Tabs defaultActiveKey="statistics" className="mb-3 mt-3">
          <Tab eventKey="statistics" title="Estatísticas">
            <UserStatistics
              id={`${this.props.params.id}`}
              profile={user.profile}
            />
          </Tab>
          {this.state.user.profile !== "staff" ? (
            <Tab eventKey="reserves" title="Reservas">
              <UserReserves
                id={`${this.props.params.id}`}
                profile={user.profile}
              />
            </Tab>
          ) : null}
          {this.state.user.profile === "staff" ? (
            <Tab eventKey="cleanings" title="Limpezas">
              <UserCleanings
                id={`${this.props.params.id}`}
                profile={user.profile}
              />
            </Tab>
          ) : null}
        </Tabs>
      </If>
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
  return <UserData {...props} params={params} navigate={navigate} />;
}
