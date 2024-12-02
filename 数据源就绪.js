state.key1 = data.ClientText.formData.InGameKey.split('_')[0];
state.key2 = data.ClientText.formData.InGameKey.split('_')[1];
state.key3 = data.ClientText.formData.InGameKey.split('_')[2];
state.where1 = 'mainInterface'
state.where2 = data.ClientText.formData.Context
state.what = (data.ClientText.formData.Context.match(/What:\s*(.*)/) || [])[1] || "";
state.how = (data.ClientText.formData.Context.match(/How:\s*(.*)/) || [])[1] || "";
state.textSceneInformation1 = data.ClientText.formData.Context.match(/^\s*(Backlog|Mcat|JIRA)/)[1];