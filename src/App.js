import logo from './logo.svg';
import './App.css';
import { Stack, Form, Button } from 'react-bootstrap';
import { readString } from 'react-papaparse';
// import assert from "assert"

import mondaySdk from "monday-sdk-js";


const monday = mondaySdk();

String.prototype.escapeSpecialChars = function() {
  return this.replace(/\\n/g, "\\n")
             .replace(/\\'/g, "\\'")
             .replace(/\\"/g, '\\"')
             .replace(/\\&/g, "\\&")
             .replace(/\\r/g, "\\r")
             .replace(/\\t/g, "\\t")
             .replace(/\\b/g, "\\b")
             .replace(/\\f/g, "\\f");
};

const submit = async (e) => {
  e.preventDefault();
  let mondayToken = e.target[0].value
  let slackKey = e.target[1].value
  let year = e.target[2].value
  let mondayShortName = e.target[3].value
  let slackShortName = e.target[4].value
  let evalDueDate = e.target[5].value
  let rosterData = e.target[6].value

  // !!!! CHANGE THESE !!!!
  // Eventually this will be kinda automated but I'm lazy.
  let workspaceId = "2348361"
  let yearFolderId = "13255619"
  let templateId = "4052932901"
  let firstNameIdx = 0;
  let lastNameIdx = 1;
  let emailIdx = 2;
  let roleIdx = 3;

  monday.setToken(mondayToken)

  var eventFolderId = -1;
  var boards = [];
  var errors = [];
  var res = {};
  var keys = [];

  res = await monday.api(`mutation { create_folder (name: \"${mondayShortName}\" , workspace_id: ${workspaceId}, parent_folder_id: ${yearFolderId}) { id }}`)
  eventFolderId = res.data.create_folder.id

  await new Promise(r => setTimeout(r, 10 * 1000));

  //chunk and loop logic based on CSV
  var rosterParsed = {};
  readString(rosterData, {
    complete: (result) => {
      rosterParsed = result.data
    }
  })

  //VC Reports
  boards.push({
    board: "vc",
    boardName: `VC Reports - ${mondayShortName}`,
    keyVolSups: rosterParsed.filter(el => {
      return el[roleIdx] == "Volunteer Coordinator"
    }),
    boardRoster: rosterParsed.filter(el => {
      return el[roleIdx] == "Practice Field Attendant" ||
        el[roleIdx] == "Welcome Table" ||
        el[roleIdx] == "Volunteer Check-in" ||
        el[roleIdx] == "Quiet Room Attendant"
    }),
  })

  //Head Ref Reports
  boards.push({
    board: "hr",
    boardName: `Head Ref Reports - ${mondayShortName}`,
    keyVolSups: rosterParsed.filter(el => {
      return el[roleIdx] == "Head Referee"
    }),
    boardRoster: rosterParsed.filter(el => {
      return el[roleIdx] == "Referee" ||
        el[roleIdx] == "Offical Scorer"
    }),
  })

  //FTA Reports
  boards.push({
    board: "fta",
    boardName: `FTA Reports - ${mondayShortName}`,
    keyVolSups: rosterParsed.filter(el => {
      return el[roleIdx] == "FIRST Technical Advisor"
    }),
    boardRoster: rosterParsed.filter(el => {
      return el[roleIdx] == "Field Supervisor" ||
        el[roleIdx] == "Scorekeeper" ||
        el[roleIdx] == "FIRST Technical Advisor Assistant" ||
        el[roleIdx] == "Control System Advisor" ||
        el[roleIdx] == "Lead Queuer"
    }),
  })

  //Field Supervisor Reports
  boards.push({
    board: "fieldSup",
    boardName: `Field Sup Reports - ${mondayShortName}`,
    keyVolSups: rosterParsed.filter(el => {
      return el[roleIdx] == "Field Supervisor"
    }),
    boardRoster: rosterParsed.filter(el => {
      return el[roleIdx] == "Field Resetter"
    }),
  })

  //Lead Que Reports
  boards.push({
    board: "leadQue",
    boardName: `Lead Que Reports - ${mondayShortName}`,
    keyVolSups: rosterParsed.filter(el => {
      return el[roleIdx] == "Lead Queuer"
    }),
    boardRoster: rosterParsed.filter(el => {
      return el[roleIdx] == "Queuer"
    }),
  })

  //AV Director Reports
  boards.push({
    board: "av",
    boardName: `AV Director Reports - ${mondayShortName}`,
    keyVolSups: rosterParsed.filter(el => {
      return el[roleIdx] == "AV Director"
    }),
    boardRoster: rosterParsed.filter(el => {
      return el[roleIdx] == "Assistant AV Director" ||
        el[roleIdx] == "Audio/Visual Attendant" ||
        el[roleIdx] == "Event Photographer" ||
        el[roleIdx] == "Emcee" ||
        el[roleIdx] == "Game Announcer"
    }),
  })

  //Judge Advisor Reports
  boards.push({
    board: "ja",
    boardName: `JA Reports - ${mondayShortName}`,
    keyVolSups: rosterParsed.filter(el => {
      return el[roleIdx] == "Judge Advisor"
    }),
    boardRoster: rosterParsed.filter(el => {
      return el[roleIdx] == "Judge" ||
        el[roleIdx] == "Judge - Dean's List Award" ||
        el[roleIdx] == "Judge - FIRST Impact Award" ||
        el[roleIdx] == "Judge Advisor Assistant"
    }),
  })

  //LRI Reports
  boards.push({
    board: "lri",
    boardName: `LRI Reports - ${mondayShortName}`,
    keyVolSups: rosterParsed.filter(el => {
      return el[roleIdx] == "Lead Robot Inspector"
    }),
    boardRoster: rosterParsed.filter(el => {
      return el[roleIdx] == "Robot Inspector" ||
        el[roleIdx] == "Inspection Manager"
    }),
  })

  //Event Manager Reports
  boards.push({
    board: "em",
    boardName: `EM Reports - ${mondayShortName}`,
    keyVolSups: rosterParsed.filter(el => {
      return el[roleIdx] == "Event Manager"
    }),
    boardRoster: rosterParsed.filter(el => {
      return el[roleIdx] == "Pit Administration Supervisor" ||
        el[roleIdx] == "Emcee Assistant" ||
        el[roleIdx] == "Safety Manager"
    }),
  })

  //Safety Manager Reports
  boards.push({
    board: "safety",
    boardName: `Safety Manager Reports - ${mondayShortName}`,
    keyVolSups: rosterParsed.filter(el => {
      return el[roleIdx] == "Safety Manager"
    }),
    boardRoster: rosterParsed.filter(el => {
      return el[roleIdx] == "Safety Attendant"
    }),
  })

  //Pit Admin Reports
  boards.push({
    board: "pit",
    boardName: `Pit Admin Reports - ${mondayShortName}`,
    keyVolSups: rosterParsed.filter(el => {
      return el[roleIdx] == "Pit Administration Supervisor"
    }),
    boardRoster: rosterParsed.filter(el => {
      return el[roleIdx] == "Pit Administrator" ||
        el[roleIdx] == "Spare Parts Attendant" ||
        el[roleIdx] == "Machine Shop Coordinator"
    }),
  })

  //Machine Shop Sup Reports
  boards.push({
    board: "shop",
    boardName: `Machine Shop Reports - ${mondayShortName}`,
    keyVolSups: rosterParsed.filter(el => {
      return el[roleIdx] == "Machine Shop Coordinator"
    }),
    boardRoster: rosterParsed.filter(el => {
      return el[roleIdx] == "Machine Shop Runner" ||
        el[roleIdx] == "Machine Shop Staff"
    }),
  })

  // assert(boards.length == 12)

  for(const board of boards) {
    res = await monday.api(`mutation { 
                          create_board (
                            board_name: \"${board.boardName}\",
                            board_kind: share,
                            workspace_id: ${workspaceId},
                            folder_id: ${eventFolderId},
                            template_id: ${templateId}
                          ) {
                            id
                          }
                        }`
                      )

    await new Promise(r => setTimeout(r, 20 * 1000));

    // if(res.errors && res.errors.length > 0)
    //   res.errors.forEach(err => {
    //     errors.push(err);
    //   });
    
    // assert(res.data.create_board.id)
    const boardId = res.data.create_board.id

    //todo: add people to board and dynamically add them.

    for (const vol of board.boardRoster) {
      var colVals = {
        "Roles": vol[roleIdx],
        "Due Date": evalDueDate,
      }

      var query = `mutation { 
        create_item (
          board_id: ${boardId},
          item_name: \"${vol[firstNameIdx]} ${vol[lastNameIdx]} - ${vol[roleIdx]}\",
          column_values: ${JSON.stringify(JSON.stringify(colVals))}
        ) {
          id
        }
      }`
      console.log(query)
      res = await monday.api(query)

      console.log(res)

      // if(res.errors.length > 0)
      //   res.errors.forEach(err => {
      //     errors.push(err)
      //   })
    }
    
    //Add keys to array so we can push slack invites
    keys.push(board.keyVolSups);

    if(errors.length > 0) {
      console.error("*******************************")
      console.error(`ERROR: ${board.boardName} Board`)
      console.error("*******************************")
      errors.forEach(err => {
        console.error(err)
      });

      errors = [];
    }
  }
}

function App() {
  return (
    <>
      <Stack gap={3}>
        <p>Tuesday - FRC Event Prep Utility</p>
        <Form onSubmit={submit} enctype="multipart/form-data">
          <Form.Group>
            <Form.Label>Monday.com Token</Form.Label>
            <Form.Control type='text' placeholder='Enter token here...' />
          </Form.Group>

          <Form.Group>
            <Form.Label>Slack API Key</Form.Label>
            <Form.Control type='text' placeholder='Enter API key here...' />
          </Form.Group>

          <Form.Group>
            <Form.Label>Year</Form.Label>
            <Form.Control type='number' placeholder='e.g. 2024' />
          </Form.Group>

          <Form.Group>
            <Form.Label>Event Short Name for Monday</Form.Label>
            <Form.Control type='text' placeholder='e.g. San Francisco 2024' />
          </Form.Group>

          <Form.Group>
            <Form.Label>Event Short Code for Slack</Form.Label>
            <Form.Control type='text' placeholder='e.g. 2024-inwla' />
          </Form.Group>

          <Form.Group>
            <Form.Label>Due Date for Evals</Form.Label>
            <Form.Control type='date'/>
          </Form.Group>

          <Form.Group>
            <Form.Label>Upload entire roster</Form.Label>
            <Form.Control as="textarea" rows={3} />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Stack>
    </>
  );
}

export default App;
