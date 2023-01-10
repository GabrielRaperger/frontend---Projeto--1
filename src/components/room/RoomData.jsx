import React from "react";
import axios from "axios";
import Content from "../template/Content";
import { useParams } from "react-router";
import RoomReserves from "./RoomReserves";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { baseApiUrl, showError, showSuccess } from "../../config/global";
import Accordion from "react-bootstrap/Accordion";
import AccordionHeader from "../template/AccordionHeader";
import Badge from "react-bootstrap/Badge";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { Modal, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import RoomStatistics from "./RoomStatistics";
import RoomCleanings from "./RoomCleanings";
import {
  formatStringToISODate,
  getCurrentAsISO,
  isAfter,
} from "../../config/moment";

const initState = {
  rooms: {},
  statusIcon: "",
  statusColor: "",
  statusAction: "",
  showModal: false,
  motivo: "",
};

class CenterData extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...initState };
    this.updateMotivo = this.updateMotivo.bind(this);
  }
  componentDidMount() {
    const id = this.props.params.id;
    this.loadRoom(id);
  }
  async loadRoom(id) {
    const url = `${baseApiUrl}/room/${id}`;
    await axios
      .get(url)
      .then(async (res) => {
        this.setState({ rooms: res.data });
        res.data.status.code === 100 ? this.activate() : this.inactivate();
      })
      .catch(showError);
  }
  updateRooms() {
    if (this.state.rooms.status) {
      const code = this.state.rooms.status.code === 100 ? 104 : 100;
      if (code == 104) {
        this.setState({ showModal: true });
      } else {
        axios
          .put(
            `${baseApiUrl}/room/${this.props.params.id}/status?status=${code}`
          )
          .then(() => {
            showSuccess("Operação realizada com sucesso");
            this.loadRoom(this.props.params.id);
          })
          .catch(showError);
      }
    }
  }
  updateMotivo(event) {
    this.setState({ motivo: event.target.value });
  }
  inactivateRoom() {
    const code = 104;
    var message = this.state.motivo;
    if (typeof message === "string" && message.length === 0) {
      message = null;
    }
    if (message) {
      axios
        .put(
          `${baseApiUrl}/room/${this.props.params.id}/status?status=${code}&message=${message}`
        )
        .then(() => {
          this.setState({ showModal: false });
          showSuccess("Operação realizada com sucesso");
          this.loadRoom(this.props.params.id);
        })
        .catch(showError);
    } else {
      axios
        .put(`${baseApiUrl}/room/${this.props.params.id}/status?status=${code}`)
        .then(() => {
          this.setState({ showModal: false });
          showSuccess("Operação realizada com sucesso");
          this.loadRoom(this.props.params.id);
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
  deleteRooms() {
    const a = this.props.params.id;

    var config = {
      method: "delete",
      url: `${baseApiUrl}/room/${a}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then(() => {
        showSuccess("Sala excluída com sucesso");
        this.props.navigate(`/room-table`);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  formatNextCleaning() {
    const room = this.state.rooms;
    if (room) {
      var next_cleaning = formatStringToISODate(room.next_cleaning);
      var current = getCurrentAsISO();
      return isAfter(next_cleaning, current) ? room.next_cleaning : "";
    }
  }
  renderModal() {
    return (
      <Modal
        size="lg"
        centered
        show={this.state.showModal}
        onHide={() => this.setState({ showModal: false })}
      >
        <Modal.Header closeButton>
          <Modal.Title>Inativar sala</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-floating">
            <textarea
              className="form-control"
              name="motivo"
              placeholder="motivo"
              value={this.state.motivo}
              onChange={this.updateMotivo}
            ></textarea>
            <label>Motivo</label>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-dark ms-2"
            onClick={() => this.setState({ showModal: false })}
          >
            Cancelar
          </button>
          <button
            className="btn btn-dark ms-2"
            onClick={() => this.inactivateRoom()}
          >
            OK
          </button>
        </Modal.Footer>
      </Modal>
    );
  }
  renderAccordion() {
    return (
      <Accordion>
        <Accordion.Item>
          <Accordion.Header>
            <AccordionHeader icon="fa fa-home" title={this.state.rooms.name} />
          </Accordion.Header>
          <Accordion.Body>
            <div className="row">
              <div className="col-md-5">
                <h6>Centro Geográfico</h6>
                <p>
                  {this.state.rooms.center ? this.state.rooms.center.name : ""}
                </p>
              </div>
              <div className="col-md-5">
                <h6>Capacidade</h6>
                <p>{this.state.rooms.allow_capacity} / {this.state.rooms.max_capacity}</p>
              </div>
              <div className="col-md-2">
                <h6>Ações</h6>
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>Editar</Tooltip>}
                >
                  <Link
                    className="btn btn-link"
                    to={`/room-form/${this.props.params.id}`}
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
                    onClick={() => this.updateRooms()}
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
                    onClick={() => this.deleteRooms()}
                  >
                    <i className="fa fa-trash text-danger"></i>
                  </button>
                </OverlayTrigger>
              </div>
              <div className="col-md-5">
                <h6>Data de Criação</h6>
                <p>{this.state.rooms.created_at}</p>
              </div>
              <div className="col-md-5">
                <h6>Intervalo Para Limpeza</h6>
                <p>{this.state.rooms.min_time_cleaning} Min</p>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-5">
                <div>
                  <h6>Estado</h6>
                  {this.state.rooms.status ? (
                    this.state.rooms.status.code === 100 ? (
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
              </div>
              <div className="col-md-5">
                <h6>Última limpeza</h6>
                <p>{this.state.rooms.last_cleaning}</p>
              </div>
              <div className="col-md-2">
                <h6>Próxima limpeza</h6>
                <p>{this.formatNextCleaning()}</p>
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  }
  renderTabs() {
    return (
      <Tabs defaultActiveKey="statistics" className="mb-3 mt-3">
        <Tab eventKey="statistics" title="Estatísticas">
          <RoomStatistics id={`${this.props.params.id}`} />
        </Tab>
        <Tab eventKey="reserves" title="Reservas">
          <RoomReserves id={`${this.props.params.id}`} />
        </Tab>
        <Tab eventKey="cleanings" title="Limpezas">
          <RoomCleanings id={`${this.props.params.id}`} />
        </Tab>
      </Tabs>
    );
  }
  render() {
    return (
      <Content>
        {this.renderModal()}
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
