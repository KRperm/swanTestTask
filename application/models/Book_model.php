<?php

class Book_model extends CI_Model {

        public function __construct()
        {
            $this->load->database();
        }

        public function get_books(){
        	$query = $this->db->get("book");
        	return $query->result_array();
        }

        private function input_book($action){
        	if($this->input->post("book")){

        		$jb = json_decode($this->input->post("book"));
        		$data = array();
        		foreach ($jb as $key => $value) {
        			$data[$key] = $value;
        		}

        		return $this->$action($data);
        	}

        	return null;
        }

		function add($data)
	    {
	        $this->db->insert('book', $data);
		}

		function edit($data)
	    {
	        $this->db->where('bookId', $data["bookId"]);
			unset($data["bookId"]);
			$this->db->update('book', $data);
	    }

	    function remove($data){
	        $this->db->where('bookId', $data["bookId"]);
			$this->db->delete('book');
	    }


        public function add_book(){
        	return $this->input_book('add');
        }

        public function edit_book(){
        	return $this->input_book('edit');
        }

        public function remove_book(){
        	return $this->input_book('remove');
        }
}