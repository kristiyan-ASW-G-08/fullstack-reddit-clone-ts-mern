import React, { FC, useEffect, useState, useContext } from 'react';
import RuleType from '@rddt/common/types/Rule';
import RuleForm from './RuleForm/RuleForm';
import Modal from 'components/Modal/Modal';
import Rule from './Rule';
import RuleFormValues from 'types/RuleFormValues';
import { Typography, Button, Collapse } from 'antd';
import { Empty } from 'antd';
import axios from 'axios';
import RootStoreContext from 'stores/RootStore/RootStore';
interface RulePaneProps {
  communityId: string;
}
const RulePane: FC<RulePaneProps> = ({ communityId }) => {
  const { authStore, modalStore } = useContext(RootStoreContext);
  const [rules, setRules] = useState<RuleType[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [formType, setFormType] = useState<'Add' | 'Edit'>('Add');
  const [editRule, setEditRule] = useState<RuleType>();
  const { token } = authStore.authState;
  const { userId } = authStore.authState.user;
  useEffect(() => {
    axios
      .get(`http://localhost:8080/communities/${communityId}/rules`)
      .then(request => {
        setRules(request.data.data.rules);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);
  const cancelHandler = () => setVisible(false);
  const addRuleHandler = async (values: RuleFormValues) => {
    try {
      setFormType('Add');
      const request = await axios.post(
        `http://localhost:8080/communities/${communityId}/rules`,
        values,
        {
          headers: { Authorization: 'bearer ' + token },
        },
      );
      const { rule } = request.data.data;
      setRules([...rules, rule]);
    } catch (err) {
      console.log(err);
    }
  };
  const setEditHandler = async (rule: RuleType) => {
    setEditRule(rule);
    setFormType('Edit');
    setVisible(true);
  };
  const editRuleHandler = async (values: RuleFormValues) => {
    try {
      if (!editRule) {
        throw '';
      }
      const request = await axios.patch(
        `http://localhost:8080/communities/rules/${editRule._id}`,
        values,
        {
          headers: { Authorization: 'bearer ' + token },
        },
      );
      const { rule } = request.data.data;
      const editedRules = rules.filter(oldRule => oldRule._id !== rule._id);
      setRules([...editedRules, rule]);
    } catch (err) {
      console.log(err);
    }
  };
  const deleteRuleHandler = async (ruleId: string) => {
    try {
      const request = await axios.delete(
        `http://localhost:8080/communities/rules/${ruleId}`,
        {
          headers: { Authorization: 'bearer ' + token },
        },
      );
      const editedRules = rules.filter(rule => rule._id !== ruleId);
      setRules(editedRules);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <Modal
        title={`${formType} Rule`}
        visible={visible}
        cancelHandler={cancelHandler}
      >
        <RuleForm
          type={formType}
          cancelHandler={cancelHandler}
          addRuleHandler={addRuleHandler}
          editRuleHandler={editRuleHandler}
          editRule={editRule}
        />
      </Modal>
      <div style={{ textAlign: 'center', margin: '1rem' }}>
        <Button
          onClick={() => {
            setVisible(true);
            setFormType('Add');
          }}
        >
          Add Rule
        </Button>
      </div>
      {rules.length === 0 ? (
        <Empty description={<span>No Rules yet</span>} />
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Collapse defaultActiveKey={['1']} style={{ width: '70%' }}>
            {rules.map(rule => (
              <Collapse.Panel header={rule.name} key="1">
                <Rule
                  key={rule._id}
                  rule={rule}
                  deleteRuleHandler={deleteRuleHandler}
                  setEditHandler={setEditHandler}
                />
              </Collapse.Panel>
            ))}
          </Collapse>
        </div>
      )}
    </>
  );
};
export default RulePane;
